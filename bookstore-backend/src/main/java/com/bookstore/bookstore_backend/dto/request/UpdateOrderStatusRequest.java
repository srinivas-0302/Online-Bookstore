package com.bookstore.bookstore_backend.dto.request;

import com.bookstore.bookstore_backend.enums.OrderStatus;
import jakarta.validation.constraints.NotNull;

public record UpdateOrderStatusRequest(

        @NotNull(message = "Status is required")
        OrderStatus status
) { }