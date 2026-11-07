package com.bookstore.bookstore_backend.dto.response;

public record CategoryResponse(
        Long categoryId,
        String name,
        String description
) { }