package com.bookstore.bookstore_backend.dto.request;

import jakarta.validation.constraints.*;

import java.math.BigDecimal;
import java.time.LocalDate;

public record BookRequest(

        @NotBlank(message = "Title is required")
        @Size(max = 200, message = "Title must be at most 200 characters")
        String title,

        @NotBlank(message = "Author is required")
        @Size(max = 150, message = "Author must be at most 150 characters")
        String author,

        @Size(max = 2000, message = "Description must be at most 2000 characters")
        String description,

        @NotNull(message = "Price is required")
        @DecimalMin(value = "0.01", message = "Price must be greater than 0")
        @Digits(integer = 8, fraction = 2, message = "Price can have up to 8 digits and 2 decimal places")
        BigDecimal price,

        @NotNull(message = "Category is required")
        Long categoryId,

        @NotBlank(message = "ISBN is required")
        @Size(max = 20, message = "ISBN must be at most 20 characters")
        String isbn,

        @NotNull(message = "Stock quantity is required")
        @Min(value = 0, message = "Stock quantity cannot be negative")
        Integer stockQuantity,

        @Size(max = 500, message = "Image URL must be at most 500 characters")
        String imageUrl,

        @PastOrPresent(message = "Published date cannot be in the future")
        LocalDate publishedDate
) { }