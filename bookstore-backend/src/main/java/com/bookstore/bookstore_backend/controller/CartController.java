package com.bookstore.bookstore_backend.controller;

import com.bookstore.bookstore_backend.dto.request.AddToCartRequest;
import com.bookstore.bookstore_backend.dto.request.UpdateCartItemRequest;
import com.bookstore.bookstore_backend.dto.response.CartResponse;
import com.bookstore.bookstore_backend.security.CustomUserDetails;
import com.bookstore.bookstore_backend.service.CartService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/cart")
@RequiredArgsConstructor
public class CartController {

    private final CartService cartService;

    @GetMapping
    public ResponseEntity<CartResponse> getCart(@AuthenticationPrincipal CustomUserDetails principal) {
        return ResponseEntity.ok(cartService.getCart(principal.getUserId()));
    }

    @PostMapping("/items")
    public ResponseEntity<CartResponse> addItem(@AuthenticationPrincipal CustomUserDetails principal,
                                                @Valid @RequestBody AddToCartRequest request) {
        return ResponseEntity.ok(cartService.addItem(principal.getUserId(), request));
    }

    @PutMapping("/items/{cartItemId}")
    public ResponseEntity<CartResponse> updateItem(@AuthenticationPrincipal CustomUserDetails principal,
                                                   @PathVariable("cartItemId") Long cartItemId,
                                                   @Valid @RequestBody UpdateCartItemRequest request) {
        return ResponseEntity.ok(
                cartService.updateItemQuantity(principal.getUserId(), cartItemId, request));
    }

    @DeleteMapping("/items/{cartItemId}")
    public ResponseEntity<CartResponse> removeItem(@AuthenticationPrincipal CustomUserDetails principal,
                                                   @PathVariable("cartItemId") Long cartItemId) {
        return ResponseEntity.ok(cartService.removeItem(principal.getUserId(), cartItemId));
    }

    @DeleteMapping
    public ResponseEntity<Void> clearCart(@AuthenticationPrincipal CustomUserDetails principal) {
        cartService.clearCart(principal.getUserId());
        return ResponseEntity.noContent().build();
    }
}