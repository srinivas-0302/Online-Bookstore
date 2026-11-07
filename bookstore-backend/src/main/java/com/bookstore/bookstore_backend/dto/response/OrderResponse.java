package com.bookstore.bookstore_backend.dto.response;

import com.bookstore.bookstore_backend.enums.OrderStatus;
import com.bookstore.bookstore_backend.enums.PaymentStatus;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public record OrderResponse(
        Long orderId,
        Long customerId,
        String customerName,
        String customerEmail,
        LocalDateTime orderDate,
        OrderStatus orderStatus,
        PaymentStatus paymentStatus,
        String shippingAddress,
        List<OrderItemResponse> items,
        int totalItems,
        BigDecimal totalAmount
) { }