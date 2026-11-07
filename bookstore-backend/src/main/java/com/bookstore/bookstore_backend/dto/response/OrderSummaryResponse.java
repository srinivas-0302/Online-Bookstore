package com.bookstore.bookstore_backend.dto.response;

import com.bookstore.bookstore_backend.enums.OrderStatus;
import com.bookstore.bookstore_backend.enums.PaymentStatus;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record OrderSummaryResponse(
        Long orderId,
        LocalDateTime orderDate,
        OrderStatus orderStatus,
        PaymentStatus paymentStatus,
        int totalItems,
        BigDecimal totalAmount
) { }