package com.bookstore.bookstore_backend.controller;

import com.bookstore.bookstore_backend.dto.response.BookResponse;
import com.bookstore.bookstore_backend.dto.response.PageResponse;
import com.bookstore.bookstore_backend.service.BookService;
import com.bookstore.bookstore_backend.util.PageUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.Set;

@RestController
@RequestMapping("/api/books")
@RequiredArgsConstructor
public class BookController {

    private static final Set<String> ALLOWED_SORT_FIELDS =
            Set.of("title", "author", "price", "publishedDate", "createdAt");

    private final BookService bookService;

    @GetMapping
    public ResponseEntity<PageResponse<BookResponse>> getBooks(
            @RequestParam(name = "keyword", required = false) String keyword,
            @RequestParam(name = "categoryId", required = false) Long categoryId,
            @RequestParam(name = "page", defaultValue = "0") int page,
            @RequestParam(name = "size", defaultValue = "10") int size,
            @RequestParam(name = "sortBy", defaultValue = "title") String sortBy,
            @RequestParam(name = "direction", defaultValue = "asc") String direction) {

        Pageable pageable = PageUtil.createPageable(page, size, sortBy, direction, ALLOWED_SORT_FIELDS);
        return ResponseEntity.ok(bookService.getBooks(keyword, categoryId, pageable));
    }

    @GetMapping("/{id}")
    public ResponseEntity<BookResponse> getBookById(@PathVariable("id") Long id) {
        return ResponseEntity.ok(bookService.getBookById(id));
    }
}