package com.bookstore.bookstore_backend.service.impl;

import com.bookstore.bookstore_backend.dto.response.DailySalesResponse;
import com.bookstore.bookstore_backend.dto.response.DashboardResponse;
import com.bookstore.bookstore_backend.dto.response.TopBookResponse;
import com.bookstore.bookstore_backend.enums.OrderStatus;
import com.bookstore.bookstore_backend.enums.Role;
import com.bookstore.bookstore_backend.exception.BadRequestException;
import com.bookstore.bookstore_backend.repository.BookRepository;
import com.bookstore.bookstore_backend.repository.CategoryRepository;
import com.bookstore.bookstore_backend.repository.OrderItemRepository;
import com.bookstore.bookstore_backend.repository.OrderRepository;
import com.bookstore.bookstore_backend.repository.UserRepository;
import com.bookstore.bookstore_backend.service.ReportService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.EnumMap;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ReportServiceImpl implements ReportService {

    private static final int LOW_STOCK_THRESHOLD = 5;
    private static final long MAX_RANGE_DAYS = 366;
    private static final int MAX_TOP_BOOKS = 20;

    private final BookRepository bookRepository;
    private final CategoryRepository categoryRepository;
    private final UserRepository userRepository;
    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;

    @Override
    public DashboardResponse getDashboard() {
        // Start with 0 for every status, so missing statuses still appear
        Map<OrderStatus, Long> ordersByStatus = new EnumMap<>(OrderStatus.class);
        for (OrderStatus status : OrderStatus.values()) {
            ordersByStatus.put(status, 0L);
        }
        for (Object[] row : orderRepository.countOrdersByStatus()) {
            ordersByStatus.put((OrderStatus) row[0], ((Number) row[1]).longValue());
        }

        BigDecimal totalSales = orderRepository.sumSalesExcluding(OrderStatus.CANCELLED);
        if (totalSales == null) {
            totalSales = BigDecimal.ZERO;      // no orders yet
        }

        return new DashboardResponse(
                bookRepository.count(),
                categoryRepository.count(),
                userRepository.countByRole(Role.CUSTOMER),
                orderRepository.count(),
                ordersByStatus,
                totalSales,
                bookRepository.countByStockQuantityLessThanEqual(LOW_STOCK_THRESHOLD),
                LOW_STOCK_THRESHOLD
        );
    }

    @Override
    public List<DailySalesResponse> getDailySales(LocalDate from, LocalDate to) {
        LocalDate end = (to != null) ? to : LocalDate.now();
        LocalDate start = (from != null) ? from : end.minusDays(29);

        if (start.isAfter(end)) {
            throw new BadRequestException("'from' date cannot be after 'to' date");
        }
        if (ChronoUnit.DAYS.between(start, end) > MAX_RANGE_DAYS) {
            throw new BadRequestException("Date range cannot be more than " + MAX_RANGE_DAYS + " days");
        }

        List<Object[]> rows = orderRepository.findDailySales(
                start.atStartOfDay(),
                end.plusDays(1).atStartOfDay(),
                OrderStatus.CANCELLED);

        Map<LocalDate, DailySalesResponse> salesByDate = new HashMap<>();
        for (Object[] row : rows) {
            LocalDate date = LocalDate.of(
                    ((Number) row[0]).intValue(),
                    ((Number) row[1]).intValue(),
                    ((Number) row[2]).intValue());
            salesByDate.put(date, new DailySalesResponse(
                    date, ((Number) row[3]).longValue(), (BigDecimal) row[4]));
        }

        // One entry for every day, with zeros on days without sales (easy for charts)
        List<DailySalesResponse> result = new ArrayList<>();
        for (LocalDate day = start; !day.isAfter(end); day = day.plusDays(1)) {
            result.add(salesByDate.getOrDefault(day,
                    new DailySalesResponse(day, 0, BigDecimal.ZERO)));
        }
        return result;
    }

    @Override
    public List<TopBookResponse> getTopSellingBooks(int limit) {
        int safeLimit = Math.min(Math.max(limit, 1), MAX_TOP_BOOKS);
        return orderItemRepository.findTopSellingBooks(
                OrderStatus.CANCELLED, PageRequest.of(0, safeLimit));
    }
}