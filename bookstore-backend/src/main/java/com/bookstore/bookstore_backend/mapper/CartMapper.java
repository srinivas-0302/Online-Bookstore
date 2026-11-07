package com.bookstore.bookstore_backend.mapper;

import com.bookstore.bookstore_backend.dto.response.CartItemResponse;
import com.bookstore.bookstore_backend.dto.response.CartResponse;
import com.bookstore.bookstore_backend.entity.Book;
import com.bookstore.bookstore_backend.entity.Cart;
import com.bookstore.bookstore_backend.entity.CartItem;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.List;

@Component
public class CartMapper {

    public CartResponse toResponse(Cart cart) {
        List<CartItemResponse> items = cart.getCartItems().stream()
                .map(this::toItemResponse)
                .toList();

        int totalItems = items.stream()
                .mapToInt(CartItemResponse::quantity)
                .sum();

        return new CartResponse(cart.getCartId(), items, totalItems, cart.getTotalAmount());
    }

    // Used when the customer has not created a cart yet
    public CartResponse emptyCart() {
        return new CartResponse(null, List.of(), 0, BigDecimal.ZERO);
    }

    private CartItemResponse toItemResponse(CartItem item) {
        Book book = item.getBook();
        return new CartItemResponse(
                item.getCartItemId(),
                book.getBookId(),
                book.getTitle(),
                book.getAuthor(),
                book.getImageUrl(),
                book.getPrice(),
                item.getQuantity(),
                item.getSubtotal(),
                book.getStockQuantity()
        );
    }
}