package com.bookstore.bookstore_backend.service;

import com.bookstore.bookstore_backend.dto.response.DailySalesResponse;
import com.bookstore.bookstore_backend.dto.response.DashboardResponse;
import com.bookstore.bookstore_backend.dto.response.TopBookResponse;

import java.time.LocalDate;
import java.util.List;

public interface ReportService {

    DashboardResponse getDashboard();

    List<DailySalesResponse> getDailySales(LocalDate from, LocalDate to);

    List<TopBookResponse> getTopSellingBooks(int limit);
}