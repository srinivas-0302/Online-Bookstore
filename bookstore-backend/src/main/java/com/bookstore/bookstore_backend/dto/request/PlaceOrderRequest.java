package com.bookstore.bookstore_backend.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record PlaceOrderRequest(

        @NotBlank(message = "Shipping address is required")
        @Size(min = 10, max = 500, message = "Shipping address must be between 10 and 500 characters")
        String shippingAddress
) { }