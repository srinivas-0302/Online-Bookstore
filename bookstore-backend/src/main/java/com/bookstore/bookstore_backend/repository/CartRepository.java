package com.bookstore.bookstore_backend.repository;

import com.bookstore.bookstore_backend.entity.Cart;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CartRepository extends JpaRepository<Cart, Long> {

    @EntityGraph(attributePaths = {"cartItems", "cartItems.book"})
    Optional<Cart> findByUser_UserId(Long userId);
}