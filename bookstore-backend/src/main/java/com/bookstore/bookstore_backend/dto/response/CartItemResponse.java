package com.bookstore.bookstore_backend.dto.response;

import java.math.BigDecimal;

public record CartItemResponse(
        Long cartItemId,
        Long bookId,
        String title,
        String author,
        String imageUrl,
        BigDecimal price,
        Integer quantity,
        BigDecimal subtotal,
        Integer availableStock
) { }