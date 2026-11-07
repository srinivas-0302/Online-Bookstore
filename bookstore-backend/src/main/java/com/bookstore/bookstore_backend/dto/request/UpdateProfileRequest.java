package com.bookstore.bookstore_backend.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record UpdateProfileRequest(

        @NotBlank(message = "Name is required")
        @Size(max = 100, message = "Name must be at most 100 characters")
        String name,

        @Pattern(regexp = "^[6-9]\\d{9}$", message = "Phone must be a valid 10-digit mobile number")
        String phone
) { }