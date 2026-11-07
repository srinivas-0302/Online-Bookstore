package com.bookstore.bookstore_backend.repository;

import com.bookstore.bookstore_backend.entity.Book;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.data.jpa.repository.Modifying;

import java.util.Optional;

public interface BookRepository extends JpaRepository<Book, Long> {

    // ----- Checks used for validation rules -----
    boolean existsByIsbn(String isbn);

    boolean existsByIsbnAndBookIdNot(String isbn, Long bookId);

    boolean existsByCategory_CategoryId(Long categoryId);

    // ----- Browse (all books, paginated) -----
    @Override
    @EntityGraph(attributePaths = "category")
    Page<Book> findAll(Pageable pageable);

    // ----- Single book with its category -----
    @EntityGraph(attributePaths = "category")
    Optional<Book> findByBookId(Long bookId);

    // ----- Filter by category -----
    @EntityGraph(attributePaths = "category")
    Page<Book> findByCategory_CategoryId(Long categoryId, Pageable pageable);

    // ----- Search by title, author or ISBN -----
    @EntityGraph(attributePaths = "category")
    @Query("""
            SELECT b FROM Book b
            WHERE LOWER(b.title)  LIKE LOWER(CONCAT('%', :keyword, '%'))
               OR LOWER(b.author) LIKE LOWER(CONCAT('%', :keyword, '%'))
               OR LOWER(b.isbn)   LIKE LOWER(CONCAT('%', :keyword, '%'))
            """)
    Page<Book> searchBooks(@Param("keyword") String keyword, Pageable pageable);

    // ----- Search inside one category -----
    @EntityGraph(attributePaths = "category")
    @Query("""
            SELECT b FROM Book b
            WHERE b.category.categoryId = :categoryId
              AND (   LOWER(b.title)  LIKE LOWER(CONCAT('%', :keyword, '%'))
                   OR LOWER(b.author) LIKE LOWER(CONCAT('%', :keyword, '%'))
                   OR LOWER(b.isbn)   LIKE LOWER(CONCAT('%', :keyword, '%')) )
            """)
    Page<Book> searchBooksInCategory(@Param("keyword") String keyword,
                                     @Param("categoryId") Long categoryId,
                                     Pageable pageable);
    // Reduces stock only if enough stock is there. Returns 1 if done, 0 if not enough stock.
    @Modifying
    @Query("""
            UPDATE Book b
            SET b.stockQuantity = b.stockQuantity - :quantity
            WHERE b.bookId = :bookId AND b.stockQuantity >= :quantity
            """)
    int decreaseStock(@Param("bookId") Long bookId, @Param("quantity") int quantity);
    @Modifying
    @Query("UPDATE Book b SET b.stockQuantity = b.stockQuantity + :quantity WHERE b.bookId = :bookId")
    int increaseStock(@Param("bookId") Long bookId, @Param("quantity") int quantity);

    // For the dashboard
    long countByStockQuantityLessThanEqual(int threshold);
}