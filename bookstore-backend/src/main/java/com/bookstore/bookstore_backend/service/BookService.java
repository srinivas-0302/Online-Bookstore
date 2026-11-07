package com.bookstore.bookstore_backend.service;

import com.bookstore.bookstore_backend.dto.request.BookRequest;
import com.bookstore.bookstore_backend.dto.response.BookResponse;
import com.bookstore.bookstore_backend.dto.response.PageResponse;
import org.springframework.data.domain.Pageable;

public interface BookService {

    BookResponse createBook(BookRequest request);

    BookResponse getBookById(Long bookId);

    PageResponse<BookResponse> getBooks(String keyword, Long categoryId, Pageable pageable);

    BookResponse updateBook(Long bookId, BookRequest request);

    void deleteBook(Long bookId);
}