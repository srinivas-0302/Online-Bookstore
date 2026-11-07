package com.bookstore.bookstore_backend.repository;

import com.bookstore.bookstore_backend.entity.Order;
import com.bookstore.bookstore_backend.enums.OrderStatus;
import jakarta.persistence.LockModeType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface OrderRepository extends JpaRepository<Order, Long> {

    // ----- Customer side (Step 9) -----
    Page<Order> findByCustomer_UserId(Long userId, Pageable pageable);

    @EntityGraph(attributePaths = {"customer", "orderItems", "orderItems.book"})
    Optional<Order> findByOrderIdAndCustomer_UserId(Long orderId, Long userId);

    // ----- Admin side -----
    @EntityGraph(attributePaths = "customer")
    @Query("""
            SELECT o FROM Order o
            WHERE (:status IS NULL OR o.orderStatus = :status)
              AND (:customerId IS NULL OR o.customer.userId = :customerId)
            """)
    Page<Order> findForAdmin(@Param("status") OrderStatus status,
                             @Param("customerId") Long customerId,
                             Pageable pageable);

    @EntityGraph(attributePaths = {"customer", "orderItems", "orderItems.book"})
    Optional<Order> findWithDetailsByOrderId(Long orderId);

    // Locks the order row until our transaction ends (SELECT ... FOR UPDATE)
    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT o FROM Order o WHERE o.orderId = :orderId")
    Optional<Order> findByIdForUpdate(@Param("orderId") Long orderId);

    // ----- Reports -----
    @Query("SELECT o.orderStatus, COUNT(o) FROM Order o GROUP BY o.orderStatus")
    List<Object[]> countOrdersByStatus();

    @Query("SELECT SUM(o.totalAmount) FROM Order o WHERE o.orderStatus <> :excluded")
    BigDecimal sumSalesExcluding(@Param("excluded") OrderStatus excluded);

    @Query("""
            SELECT YEAR(o.orderDate), MONTH(o.orderDate), DAY(o.orderDate),
                   COUNT(o), SUM(o.totalAmount)
            FROM Order o
            WHERE o.orderDate >= :from AND o.orderDate < :to
              AND o.orderStatus <> :excluded
            GROUP BY YEAR(o.orderDate), MONTH(o.orderDate), DAY(o.orderDate)
            ORDER BY YEAR(o.orderDate), MONTH(o.orderDate), DAY(o.orderDate)
            """)
    List<Object[]> findDailySales(@Param("from") LocalDateTime from,
                                  @Param("to") LocalDateTime to,
                                  @Param("excluded") OrderStatus excluded);
}