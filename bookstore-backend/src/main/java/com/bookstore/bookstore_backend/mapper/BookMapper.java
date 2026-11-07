package com.bookstore.bookstore_backend.mapper;

import com.bookstore.bookstore_backend.dto.request.BookRequest;
import com.bookstore.bookstore_backend.dto.response.BookResponse;
import com.bookstore.bookstore_backend.entity.Book;
import com.bookstore.bookstore_backend.entity.Category;
import org.springframework.stereotype.Component;

@Component
public class BookMapper {

    public Book toEntity(BookRequest request, Category category) {
        return Book.builder()
                .title(request.title().trim())
                .author(request.author().trim())
                .description(request.description())
                .price(request.price())
                .category(category)
                .isbn(request.isbn().trim())
                .stockQuantity(request.stockQuantity())
                .imageUrl(request.imageUrl())
                .publishedDate(request.publishedDate())
                .build();
    }

    public void updateEntity(Book book, BookRequest request, Category category) {
        book.setTitle(request.title().trim());
        book.setAuthor(request.author().trim());
        book.setDescription(request.description());
        book.setPrice(request.price());
        book.setCategory(category);
        book.setIsbn(request.isbn().trim());
        book.setStockQuantity(request.stockQuantity());
        book.setImageUrl(request.imageUrl());
        book.setPublishedDate(request.publishedDate());
    }

    public BookResponse toResponse(Book book) {
        return new BookResponse(
                book.getBookId(),
                book.getTitle(),
                book.getAuthor(),
                book.getDescription(),
                book.getPrice(),
                book.getCategory().getCategoryId(),
                book.getCategory().getName(),
                book.getIsbn(),
                book.getStockQuantity(),
                book.getImageUrl(),
                book.getPublishedDate(),
                book.getCreatedAt(),
                book.getUpdatedAt()
        );
    }
}