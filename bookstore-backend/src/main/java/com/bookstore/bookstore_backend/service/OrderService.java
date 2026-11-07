package com.bookstore.bookstore_backend.service;

import com.bookstore.bookstore_backend.dto.request.PlaceOrderRequest;
import com.bookstore.bookstore_backend.dto.response.OrderResponse;
import com.bookstore.bookstore_backend.dto.response.OrderSummaryResponse;
import com.bookstore.bookstore_backend.dto.response.PageResponse;
import org.springframework.data.domain.Pageable;

public interface OrderService {

    OrderResponse placeOrder(Long userId, PlaceOrderRequest request);

    PageResponse<OrderSummaryResponse> getMyOrders(Long userId, Pageable pageable);

    OrderResponse getMyOrderById(Long userId, Long orderId);
}