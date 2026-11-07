package com.bookstore.bookstore_backend.repository;

import com.bookstore.bookstore_backend.dto.response.TopBookResponse;
import com.bookstore.bookstore_backend.entity.OrderItem;
import com.bookstore.bookstore_backend.enums.OrderStatus;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface OrderItemRepository extends JpaRepository<OrderItem, Long> {

    @Query("""
            SELECT new com.bookstore.bookstore_backend.dto.response.TopBookResponse(
                       b.bookId, b.title, b.author,
                       SUM(i.quantity), SUM(i.priceAtPurchase * i.quantity))
            FROM OrderItem i
            JOIN i.book b
            JOIN i.order o
            WHERE o.orderStatus <> :excluded
            GROUP BY b.bookId, b.title, b.author
            ORDER BY SUM(i.quantity) DESC
            """)
    List<TopBookResponse> findTopSellingBooks(@Param("excluded") OrderStatus excluded,
                                              Pageable pageable);
}