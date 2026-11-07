package com.bookstore.bookstore_backend.dto.response;

import java.math.BigDecimal;

public record OrderItemResponse(
        Long orderItemId,
        Long bookId,
        String title,
        String author,
        String imageUrl,
        Integer quantity,
        BigDecimal priceAtPurchase,
        BigDecimal subtotal
) { }