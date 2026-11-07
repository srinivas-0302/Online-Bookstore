package com.bookstore.bookstore_backend.service.impl;

import com.bookstore.bookstore_backend.dto.request.CategoryRequest;
import com.bookstore.bookstore_backend.dto.response.CategoryResponse;
import com.bookstore.bookstore_backend.entity.Category;
import com.bookstore.bookstore_backend.exception.ConflictException;
import com.bookstore.bookstore_backend.exception.ResourceNotFoundException;
import com.bookstore.bookstore_backend.mapper.CategoryMapper;
import com.bookstore.bookstore_backend.repository.BookRepository;
import com.bookstore.bookstore_backend.repository.CategoryRepository;
import com.bookstore.bookstore_backend.service.CategoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class CategoryServiceImpl implements CategoryService {

    private final CategoryRepository categoryRepository;
    private final BookRepository bookRepository;
    private final CategoryMapper categoryMapper;

    @Override
    @Transactional
    public CategoryResponse createCategory(CategoryRequest request) {
        String name = request.name().trim();

        if (categoryRepository.existsByNameIgnoreCase(name)) {
            throw new ConflictException("Category already exists with name: " + name);
        }

        Category saved = categoryRepository.save(categoryMapper.toEntity(request));
        return categoryMapper.toResponse(saved);
    }

    @Override
    public List<CategoryResponse> getAllCategories() {
        return categoryRepository.findAll().stream()
                .map(categoryMapper::toResponse)
                .toList();
    }

    @Override
    public CategoryResponse getCategoryById(Long categoryId) {
        return categoryMapper.toResponse(findCategoryOrThrow(categoryId));
    }

    @Override
    @Transactional
    public CategoryResponse updateCategory(Long categoryId, CategoryRequest request) {
        Category category = findCategoryOrThrow(categoryId);
        String name = request.name().trim();

        if (categoryRepository.existsByNameIgnoreCaseAndCategoryIdNot(name, categoryId)) {
            throw new ConflictException("Category already exists with name: " + name);
        }

        categoryMapper.updateEntity(category, request);
        // No save() call needed. Hibernate notices the change and updates the row (dirty checking).
        return categoryMapper.toResponse(category);
    }

    @Override
    @Transactional
    public void deleteCategory(Long categoryId) {
        Category category = findCategoryOrThrow(categoryId);

        if (bookRepository.existsByCategory_CategoryId(categoryId)) {
            throw new ConflictException(
                    "Category cannot be deleted because books are linked with it");
        }

        categoryRepository.delete(category);
    }

    // ----- private helper -----
    private Category findCategoryOrThrow(Long categoryId) {
        return categoryRepository.findById(categoryId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Category not found with id: " + categoryId));
    }
}