package com.bookstore.bookstore_backend.dto.response;

import java.math.BigDecimal;
import java.util.List;

public record CartResponse(
        Long cartId,
        List<CartItemResponse> items,
        int totalItems,
        BigDecimal totalAmount
) { }