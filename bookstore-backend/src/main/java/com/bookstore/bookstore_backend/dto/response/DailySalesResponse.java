package com.bookstore.bookstore_backend.dto.response;

import java.math.BigDecimal;
import java.time.LocalDate;

public record DailySalesResponse(
        LocalDate date,
        long orderCount,
        BigDecimal totalAmount
) { }