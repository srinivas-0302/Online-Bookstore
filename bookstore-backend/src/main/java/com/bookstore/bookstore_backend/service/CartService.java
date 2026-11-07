package com.bookstore.bookstore_backend.service;

import com.bookstore.bookstore_backend.dto.request.AddToCartRequest;
import com.bookstore.bookstore_backend.dto.request.UpdateCartItemRequest;
import com.bookstore.bookstore_backend.dto.response.CartResponse;

public interface CartService {

    CartResponse getCart(Long userId);

    CartResponse addItem(Long userId, AddToCartRequest request);

    CartResponse updateItemQuantity(Long userId, Long cartItemId, UpdateCartItemRequest request);

    CartResponse removeItem(Long userId, Long cartItemId);

    void clearCart(Long userId);
}