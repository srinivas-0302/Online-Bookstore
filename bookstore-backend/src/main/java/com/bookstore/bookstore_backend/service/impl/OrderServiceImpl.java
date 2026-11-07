package com.bookstore.bookstore_backend.service.impl;

import com.bookstore.bookstore_backend.dto.request.PlaceOrderRequest;
import com.bookstore.bookstore_backend.dto.response.OrderResponse;
import com.bookstore.bookstore_backend.dto.response.OrderSummaryResponse;
import com.bookstore.bookstore_backend.dto.response.PageResponse;
import com.bookstore.bookstore_backend.entity.Book;
import com.bookstore.bookstore_backend.entity.Cart;
import com.bookstore.bookstore_backend.entity.CartItem;
import com.bookstore.bookstore_backend.entity.Order;
import com.bookstore.bookstore_backend.entity.OrderItem;
import com.bookstore.bookstore_backend.enums.OrderStatus;
import com.bookstore.bookstore_backend.enums.PaymentStatus;
import com.bookstore.bookstore_backend.exception.BadRequestException;
import com.bookstore.bookstore_backend.exception.ResourceNotFoundException;
import com.bookstore.bookstore_backend.mapper.OrderMapper;
import com.bookstore.bookstore_backend.repository.BookRepository;
import com.bookstore.bookstore_backend.repository.CartRepository;
import com.bookstore.bookstore_backend.repository.OrderRepository;
import com.bookstore.bookstore_backend.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.Comparator;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class OrderServiceImpl implements OrderService {

    private final OrderRepository orderRepository;
    private final CartRepository cartRepository;
    private final BookRepository bookRepository;
    private final OrderMapper orderMapper;

    @Override
    @Transactional
    public OrderResponse placeOrder(Long userId, PlaceOrderRequest request) {

        // 1. Load the customer's cart (with items and books)
        Cart cart = cartRepository.findByUser_UserId(userId)
                .orElseThrow(() -> new BadRequestException("Your cart is empty"));

        if (cart.getCartItems().isEmpty()) {
            throw new BadRequestException("Your cart is empty");
        }

        // 2. Process books in the same order every time (by book id).
        //    This avoids deadlocks when two customers order the same books together.
        List<CartItem> cartItems = cart.getCartItems().stream()
                .sorted(Comparator.comparing((CartItem item) -> item.getBook().getBookId()))
                .toList();

        Order order = Order.builder()
                .customer(cart.getUser())
                .orderStatus(OrderStatus.PLACED)
                .paymentStatus(PaymentStatus.PENDING)
                .shippingAddress(request.shippingAddress().trim())
                .build();

        BigDecimal totalAmount = BigDecimal.ZERO;

        // 3. For each book: reduce stock safely, then create the order item
        for (CartItem cartItem : cartItems) {
            Book book = cartItem.getBook();

            int updatedRows = bookRepository.decreaseStock(book.getBookId(), cartItem.getQuantity());
            if (updatedRows == 0) {
                throw new BadRequestException("Not enough stock for '" + book.getTitle()
                        + "'. Please reduce the quantity in your cart");
            }

            OrderItem orderItem = OrderItem.builder()
                    .book(book)
                    .quantity(cartItem.getQuantity())
                    .priceAtPurchase(book.getPrice())      // price is frozen here
                    .build();

            order.addItem(orderItem);
            totalAmount = totalAmount.add(orderItem.getSubtotal());
        }

        // 4. Save the order, then empty the cart
        order.setTotalAmount(totalAmount);
        Order savedOrder = orderRepository.save(order);

        cart.getCartItems().clear();

        return orderMapper.toResponse(savedOrder);
    }

    @Override
    public PageResponse<OrderSummaryResponse> getMyOrders(Long userId, Pageable pageable) {
        Page<Order> page = orderRepository.findByCustomer_UserId(userId, pageable);
        return PageResponse.from(page.map(orderMapper::toSummary));
    }

    @Override
    public OrderResponse getMyOrderById(Long userId, Long orderId) {
        Order order = orderRepository.findByOrderIdAndCustomer_UserId(orderId, userId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Order not found with id: " + orderId));
        return orderMapper.toResponse(order);
    }
}