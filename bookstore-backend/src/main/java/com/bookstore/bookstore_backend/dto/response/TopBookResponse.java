package com.bookstore.bookstore_backend.dto.response;

import java.math.BigDecimal;

public record TopBookResponse(
        Long bookId,
        String title,
        String author,
        Long quantitySold,
        BigDecimal revenue
) { }