package com.bookstore.bookstore_backend.service;

import com.bookstore.bookstore_backend.dto.request.UpdateOrderStatusRequest;
import com.bookstore.bookstore_backend.dto.response.AdminOrderSummaryResponse;
import com.bookstore.bookstore_backend.dto.response.OrderResponse;
import com.bookstore.bookstore_backend.dto.response.PageResponse;
import com.bookstore.bookstore_backend.enums.OrderStatus;
import org.springframework.data.domain.Pageable;

public interface AdminOrderService {

    PageResponse<AdminOrderSummaryResponse> getAllOrders(OrderStatus status, Long customerId, Pageable pageable);

    OrderResponse getOrderById(Long orderId);

    OrderResponse updateOrderStatus(Long orderId, UpdateOrderStatusRequest request);
}