package com.bookstore.bookstore_backend.service.impl;

import com.bookstore.bookstore_backend.dto.request.BookRequest;
import com.bookstore.bookstore_backend.dto.response.BookResponse;
import com.bookstore.bookstore_backend.dto.response.PageResponse;
import com.bookstore.bookstore_backend.entity.Book;
import com.bookstore.bookstore_backend.entity.Category;
import com.bookstore.bookstore_backend.exception.ConflictException;
import com.bookstore.bookstore_backend.exception.ResourceNotFoundException;
import com.bookstore.bookstore_backend.mapper.BookMapper;
import com.bookstore.bookstore_backend.repository.BookRepository;
import com.bookstore.bookstore_backend.repository.CategoryRepository;
import com.bookstore.bookstore_backend.service.BookService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class BookServiceImpl implements BookService {

    private final BookRepository bookRepository;
    private final CategoryRepository categoryRepository;
    private final BookMapper bookMapper;

    @Override
    @Transactional
    public BookResponse createBook(BookRequest request) {
        String isbn = request.isbn().trim();

        if (bookRepository.existsByIsbn(isbn)) {
            throw new ConflictException("A book already exists with ISBN: " + isbn);
        }

        Category category = findCategoryOrThrow(request.categoryId());
        Book saved = bookRepository.save(bookMapper.toEntity(request, category));
        return bookMapper.toResponse(saved);
    }

    @Override
    public BookResponse getBookById(Long bookId) {
        Book book = bookRepository.findByBookId(bookId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Book not found with id: " + bookId));
        return bookMapper.toResponse(book);
    }

    @Override
    public PageResponse<BookResponse> getBooks(String keyword, Long categoryId, Pageable pageable) {
        boolean hasKeyword = keyword != null && !keyword.isBlank();
        Page<Book> page;

        if (hasKeyword && categoryId != null) {
            page = bookRepository.searchBooksInCategory(keyword.trim(), categoryId, pageable);
        } else if (hasKeyword) {
            page = bookRepository.searchBooks(keyword.trim(), pageable);
        } else if (categoryId != null) {
            page = bookRepository.findByCategory_CategoryId(categoryId, pageable);
        } else {
            page = bookRepository.findAll(pageable);
        }

        return PageResponse.from(page.map(bookMapper::toResponse));
    }

    @Override
    @Transactional
    public BookResponse updateBook(Long bookId, BookRequest request) {
        Book book = bookRepository.findById(bookId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Book not found with id: " + bookId));

        String isbn = request.isbn().trim();
        if (bookRepository.existsByIsbnAndBookIdNot(isbn, bookId)) {
            throw new ConflictException("A book already exists with ISBN: " + isbn);
        }

        Category category = findCategoryOrThrow(request.categoryId());
        bookMapper.updateEntity(book, request, category);

        // saveAndFlush sends the UPDATE now, so updatedAt in the response is the fresh value
        Book updated = bookRepository.saveAndFlush(book);
        return bookMapper.toResponse(updated);
    }

    @Override
    @Transactional
    public void deleteBook(Long bookId) {
        Book book = bookRepository.findById(bookId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Book not found with id: " + bookId));
        bookRepository.delete(book);
    }

    private Category findCategoryOrThrow(Long categoryId) {
        return categoryRepository.findById(categoryId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Category not found with id: " + categoryId));
    }
}