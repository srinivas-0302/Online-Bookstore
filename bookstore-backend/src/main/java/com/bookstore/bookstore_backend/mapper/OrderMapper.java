package com.bookstore.bookstore_backend.mapper;

import com.bookstore.bookstore_backend.dto.response.AdminOrderSummaryResponse;
import com.bookstore.bookstore_backend.dto.response.OrderItemResponse;
import com.bookstore.bookstore_backend.dto.response.OrderResponse;
import com.bookstore.bookstore_backend.dto.response.OrderSummaryResponse;
import com.bookstore.bookstore_backend.entity.Book;
import com.bookstore.bookstore_backend.entity.Order;
import com.bookstore.bookstore_backend.entity.OrderItem;
import com.bookstore.bookstore_backend.entity.User;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class OrderMapper {

    public OrderResponse toResponse(Order order) {
        List<OrderItemResponse> items = order.getOrderItems().stream()
                .map(this::toItemResponse)
                .toList();

        int totalItems = items.stream()
                .mapToInt(OrderItemResponse::quantity)
                .sum();

        User customer = order.getCustomer();

        return new OrderResponse(
                order.getOrderId(),
                customer.getUserId(),
                customer.getName(),
                customer.getEmail(),
                order.getOrderDate(),
                order.getOrderStatus(),
                order.getPaymentStatus(),
                order.getShippingAddress(),
                items,
                totalItems,
                order.getTotalAmount()
        );
    }

    public OrderSummaryResponse toSummary(Order order) {
        int totalItems = order.getOrderItems().stream()
                .mapToInt(OrderItem::getQuantity)
                .sum();

        return new OrderSummaryResponse(
                order.getOrderId(),
                order.getOrderDate(),
                order.getOrderStatus(),
                order.getPaymentStatus(),
                totalItems,
                order.getTotalAmount()
        );
    }

    private OrderItemResponse toItemResponse(OrderItem item) {
        Book book = item.getBook();
        return new OrderItemResponse(
                item.getOrderItemId(),
                book.getBookId(),
                book.getTitle(),
                book.getAuthor(),
                book.getImageUrl(),
                item.getQuantity(),
                item.getPriceAtPurchase(),
                item.getSubtotal()
        );
    }
    public AdminOrderSummaryResponse toAdminSummary(Order order) {
        User customer = order.getCustomer();

        int totalItems = order.getOrderItems().stream()
                .mapToInt(OrderItem::getQuantity)
                .sum();

        return new AdminOrderSummaryResponse(
                order.getOrderId(),
                customer.getUserId(),
                customer.getName(),
                customer.getEmail(),
                order.getOrderDate(),
                order.getOrderStatus(),
                order.getPaymentStatus(),
                totalItems,
                order.getTotalAmount()
        );
    }
}