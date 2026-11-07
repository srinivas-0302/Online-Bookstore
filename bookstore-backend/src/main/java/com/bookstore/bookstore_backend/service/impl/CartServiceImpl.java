package com.bookstore.bookstore_backend.service.impl;

import com.bookstore.bookstore_backend.dto.request.AddToCartRequest;
import com.bookstore.bookstore_backend.dto.request.UpdateCartItemRequest;
import com.bookstore.bookstore_backend.dto.response.CartResponse;
import com.bookstore.bookstore_backend.entity.Book;
import com.bookstore.bookstore_backend.entity.Cart;
import com.bookstore.bookstore_backend.entity.CartItem;
import com.bookstore.bookstore_backend.entity.User;
import com.bookstore.bookstore_backend.exception.BadRequestException;
import com.bookstore.bookstore_backend.exception.ResourceNotFoundException;
import com.bookstore.bookstore_backend.mapper.CartMapper;
import com.bookstore.bookstore_backend.repository.BookRepository;
import com.bookstore.bookstore_backend.repository.CartRepository;
import com.bookstore.bookstore_backend.repository.UserRepository;
import com.bookstore.bookstore_backend.service.CartService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class CartServiceImpl implements CartService {

    private final CartRepository cartRepository;
    private final BookRepository bookRepository;
    private final UserRepository userRepository;
    private final CartMapper cartMapper;

    @Override
    public CartResponse getCart(Long userId) {
        return cartRepository.findByUser_UserId(userId)
                .map(cartMapper::toResponse)
                .orElseGet(cartMapper::emptyCart);
    }

    @Override
    @Transactional
    public CartResponse addItem(Long userId, AddToCartRequest request) {
        Book book = bookRepository.findById(request.bookId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Book not found with id: " + request.bookId()));

        Cart cart = getOrCreateCart(userId);

        Optional<CartItem> existingItem = cart.getCartItems().stream()
                .filter(item -> item.getBook().getBookId().equals(book.getBookId()))
                .findFirst();

        int newQuantity = request.quantity()
                + existingItem.map(CartItem::getQuantity).orElse(0);

        validateStock(book, newQuantity);

        if (existingItem.isPresent()) {
            existingItem.get().setQuantity(newQuantity);
        } else {
            CartItem newItem = CartItem.builder()
                    .book(book)
                    .quantity(request.quantity())
                    .build();
            cart.addItem(newItem);
        }

        // Send changes to the database now, so the new item gets its id
        cartRepository.flush();
        return cartMapper.toResponse(cart);
    }

    @Override
    @Transactional
    public CartResponse updateItemQuantity(Long userId, Long cartItemId, UpdateCartItemRequest request) {
        Cart cart = findCartOrThrow(userId, cartItemId);
        CartItem item = findItemOrThrow(cart, cartItemId);

        validateStock(item.getBook(), request.quantity());

        item.setQuantity(request.quantity());   // dirty checking saves it
        return cartMapper.toResponse(cart);
    }

    @Override
    @Transactional
    public CartResponse removeItem(Long userId, Long cartItemId) {
        Cart cart = findCartOrThrow(userId, cartItemId);
        CartItem item = findItemOrThrow(cart, cartItemId);

        cart.removeItem(item);                  // orphanRemoval deletes the row
        return cartMapper.toResponse(cart);
    }

    @Override
    @Transactional
    public void clearCart(Long userId) {
        cartRepository.findByUser_UserId(userId)
                .ifPresent(cart -> cart.getCartItems().clear());
    }

    // ----- private helpers -----

    private Cart getOrCreateCart(Long userId) {
        return cartRepository.findByUser_UserId(userId).orElseGet(() -> {
            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new ResourceNotFoundException("User not found"));
            return cartRepository.save(Cart.builder().user(user).build());
        });
    }

    private Cart findCartOrThrow(Long userId, Long cartItemId) {
        return cartRepository.findByUser_UserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Cart item not found with id: " + cartItemId));
    }

    private CartItem findItemOrThrow(Cart cart, Long cartItemId) {
        return cart.getCartItems().stream()
                .filter(item -> item.getCartItemId().equals(cartItemId))
                .findFirst()
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Cart item not found with id: " + cartItemId));
    }

    private void validateStock(Book book, int requestedQuantity) {
        if (book.getStockQuantity() <= 0) {
            throw new BadRequestException("'" + book.getTitle() + "' is out of stock");
        }
        if (requestedQuantity > book.getStockQuantity()) {
            throw new BadRequestException("Only " + book.getStockQuantity()
                    + " copies of '" + book.getTitle() + "' are available");
        }
    }
}