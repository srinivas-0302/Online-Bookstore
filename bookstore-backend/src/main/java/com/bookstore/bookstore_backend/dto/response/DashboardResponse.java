package com.bookstore.bookstore_backend.dto.response;

import com.bookstore.bookstore_backend.enums.OrderStatus;

import java.math.BigDecimal;
import java.util.Map;

public record DashboardResponse(
        long totalBooks,
        long totalCategories,
        long totalCustomers,
        long totalOrders,
        Map<OrderStatus, Long> ordersByStatus,
        BigDecimal totalSales,
        long lowStockBooks,
        int lowStockThreshold
) { }