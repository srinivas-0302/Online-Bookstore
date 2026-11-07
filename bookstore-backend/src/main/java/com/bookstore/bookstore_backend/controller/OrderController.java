package com.bookstore.bookstore_backend.controller;

import com.bookstore.bookstore_backend.dto.request.PlaceOrderRequest;
import com.bookstore.bookstore_backend.dto.response.OrderResponse;
import com.bookstore.bookstore_backend.dto.response.OrderSummaryResponse;
import com.bookstore.bookstore_backend.dto.response.PageResponse;
import com.bookstore.bookstore_backend.security.CustomUserDetails;
import com.bookstore.bookstore_backend.service.OrderService;
import com.bookstore.bookstore_backend.util.PageUtil;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Set;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {

    private static final Set<String> ALLOWED_SORT_FIELDS = Set.of("orderDate", "totalAmount");

    private final OrderService orderService;

    @PostMapping
    public ResponseEntity<OrderResponse> placeOrder(@AuthenticationPrincipal CustomUserDetails principal,
                                                    @Valid @RequestBody PlaceOrderRequest request) {
        OrderResponse created = orderService.placeOrder(principal.getUserId(), request);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @GetMapping
    public ResponseEntity<PageResponse<OrderSummaryResponse>> getMyOrders(
            @AuthenticationPrincipal CustomUserDetails principal,
            @RequestParam(name = "page", defaultValue = "0") int page,
            @RequestParam(name = "size", defaultValue = "10") int size,
            @RequestParam(name = "sortBy", defaultValue = "orderDate") String sortBy,
            @RequestParam(name = "direction", defaultValue = "desc") String direction) {

        Pageable pageable = PageUtil.createPageable(page, size, sortBy, direction, ALLOWED_SORT_FIELDS);
        return ResponseEntity.ok(orderService.getMyOrders(principal.getUserId(), pageable));
    }

    @GetMapping("/{orderId}")
    public ResponseEntity<OrderResponse> getMyOrder(@AuthenticationPrincipal CustomUserDetails principal,
                                                    @PathVariable("orderId") Long orderId) {
        return ResponseEntity.ok(orderService.getMyOrderById(principal.getUserId(), orderId));
    }
}