package com.bookstore.bookstore_backend.service;

import com.bookstore.bookstore_backend.dto.request.CategoryRequest;
import com.bookstore.bookstore_backend.dto.response.CategoryResponse;

import java.util.List;

public interface CategoryService {

    CategoryResponse createCategory(CategoryRequest request);

    List<CategoryResponse> getAllCategories();

    CategoryResponse getCategoryById(Long categoryId);

    CategoryResponse updateCategory(Long categoryId, CategoryRequest request);

    void deleteCategory(Long categoryId);
}