package com.bookstore.bookstore_backend.controller;

import com.bookstore.bookstore_backend.dto.request.UpdateOrderStatusRequest;
import com.bookstore.bookstore_backend.dto.response.AdminOrderSummaryResponse;
import com.bookstore.bookstore_backend.dto.response.OrderResponse;
import com.bookstore.bookstore_backend.dto.response.PageResponse;
import com.bookstore.bookstore_backend.enums.OrderStatus;
import com.bookstore.bookstore_backend.service.AdminOrderService;
import com.bookstore.bookstore_backend.util.PageUtil;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Set;

@RestController
@RequestMapping("/api/admin/orders")
@RequiredArgsConstructor
public class AdminOrderController {

    private static final Set<String> ALLOWED_SORT_FIELDS =
            Set.of("orderDate", "totalAmount", "orderStatus");

    private final AdminOrderService adminOrderService;

    @GetMapping
    public ResponseEntity<PageResponse<AdminOrderSummaryResponse>> getAllOrders(
            @RequestParam(name = "status", required = false) OrderStatus status,
            @RequestParam(name = "customerId", required = false) Long customerId,
            @RequestParam(name = "page", defaultValue = "0") int page,
            @RequestParam(name = "size", defaultValue = "10") int size,
            @RequestParam(name = "sortBy", defaultValue = "orderDate") String sortBy,
            @RequestParam(name = "direction", defaultValue = "desc") String direction) {

        Pageable pageable = PageUtil.createPageable(page, size, sortBy, direction, ALLOWED_SORT_FIELDS);
        return ResponseEntity.ok(adminOrderService.getAllOrders(status, customerId, pageable));
    }

    @GetMapping("/{orderId}")
    public ResponseEntity<OrderResponse> getOrder(@PathVariable("orderId") Long orderId) {
        return ResponseEntity.ok(adminOrderService.getOrderById(orderId));
    }

    @PutMapping("/{orderId}/status")
    public ResponseEntity<OrderResponse> updateStatus(@PathVariable("orderId") Long orderId,
                                                      @Valid @RequestBody UpdateOrderStatusRequest request) {
        return ResponseEntity.ok(adminOrderService.updateOrderStatus(orderId, request));
    }
}