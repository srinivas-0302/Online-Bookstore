package com.bookstore.bookstore_backend.service.impl;

import com.bookstore.bookstore_backend.dto.request.UpdateOrderStatusRequest;
import com.bookstore.bookstore_backend.dto.response.AdminOrderSummaryResponse;
import com.bookstore.bookstore_backend.dto.response.OrderResponse;
import com.bookstore.bookstore_backend.dto.response.PageResponse;
import com.bookstore.bookstore_backend.entity.Order;
import com.bookstore.bookstore_backend.entity.OrderItem;
import com.bookstore.bookstore_backend.enums.OrderStatus;
import com.bookstore.bookstore_backend.enums.PaymentStatus;
import com.bookstore.bookstore_backend.exception.ConflictException;
import com.bookstore.bookstore_backend.exception.ResourceNotFoundException;
import com.bookstore.bookstore_backend.mapper.OrderMapper;
import com.bookstore.bookstore_backend.repository.BookRepository;
import com.bookstore.bookstore_backend.repository.OrderRepository;
import com.bookstore.bookstore_backend.service.AdminOrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AdminOrderServiceImpl implements AdminOrderService {

    private final OrderRepository orderRepository;
    private final BookRepository bookRepository;
    private final OrderMapper orderMapper;

    @Override
    public PageResponse<AdminOrderSummaryResponse> getAllOrders(OrderStatus status,
                                                                Long customerId,
                                                                Pageable pageable) {
        Page<Order> page = orderRepository.findForAdmin(status, customerId, pageable);
        return PageResponse.from(page.map(orderMapper::toAdminSummary));
    }

    @Override
    public OrderResponse getOrderById(Long orderId) {
        Order order = orderRepository.findWithDetailsByOrderId(orderId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Order not found with id: " + orderId));
        return orderMapper.toResponse(order);
    }

    @Override
    @Transactional
    public OrderResponse updateOrderStatus(Long orderId, UpdateOrderStatusRequest request) {

        // Lock this order row, so two admins cannot change it at the same time
        Order order = orderRepository.findByIdForUpdate(orderId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Order not found with id: " + orderId));

        OrderStatus current = order.getOrderStatus();
        OrderStatus next = request.status();

        if (!current.canMoveTo(next)) {
            throw new ConflictException(
                    "Order cannot be changed from " + current + " to " + next);
        }

        if (next == OrderStatus.CANCELLED) {
            // Put the stock back on the shelf
            for (OrderItem item : order.getOrderItems()) {
                bookRepository.increaseStock(item.getBook().getBookId(), item.getQuantity());
            }
        }

        if (next == OrderStatus.DELIVERED && order.getPaymentStatus() == PaymentStatus.PENDING) {
            order.setPaymentStatus(PaymentStatus.PAID);     // cash on delivery
        }

        order.setOrderStatus(next);     // dirty checking saves it
        return orderMapper.toResponse(order);
    }
}