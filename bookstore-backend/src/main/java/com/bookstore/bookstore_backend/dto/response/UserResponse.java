package com.bookstore.bookstore_backend.dto.response;

import java.time.LocalDateTime;

public record UserResponse(
        Long userId,
        String name,
        String email,
        String phone,
        String role,
        LocalDateTime createdAt
) { }