package com.bookstore.bookstore_backend.dto.response;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

public record BookResponse(
        Long bookId,
        String title,
        String author,
        String description,
        BigDecimal price,
        Long categoryId,
        String categoryName,
        String isbn,
        Integer stockQuantity,
        String imageUrl,
        LocalDate publishedDate,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) { }