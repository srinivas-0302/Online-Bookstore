package com.bookstore.bookstore_backend.mapper;

import com.bookstore.bookstore_backend.dto.request.CategoryRequest;
import com.bookstore.bookstore_backend.dto.response.CategoryResponse;
import com.bookstore.bookstore_backend.entity.Category;
import org.springframework.stereotype.Component;

@Component
public class CategoryMapper {

    public Category toEntity(CategoryRequest request) {
        return Category.builder()
                .name(request.name().trim())
                .description(request.description())
                .build();
    }

    public void updateEntity(Category category, CategoryRequest request) {
        category.setName(request.name().trim());
        category.setDescription(request.description());
    }

    public CategoryResponse toResponse(Category category) {
        return new CategoryResponse(
                category.getCategoryId(),
                category.getName(),
                category.getDescription()
        );
    }
}