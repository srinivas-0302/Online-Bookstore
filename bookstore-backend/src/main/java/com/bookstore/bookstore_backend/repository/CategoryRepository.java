package com.bookstore.bookstore_backend.repository;

import com.bookstore.bookstore_backend.entity.Category;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CategoryRepository extends JpaRepository<Category, Long> {

    boolean existsByNameIgnoreCase(String name);

    boolean existsByNameIgnoreCaseAndCategoryIdNot(String name, Long categoryId);
}