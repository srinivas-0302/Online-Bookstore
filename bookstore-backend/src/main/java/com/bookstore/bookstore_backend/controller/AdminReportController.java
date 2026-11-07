package com.bookstore.bookstore_backend.controller;

import com.bookstore.bookstore_backend.dto.response.DailySalesResponse;
import com.bookstore.bookstore_backend.dto.response.DashboardResponse;
import com.bookstore.bookstore_backend.dto.response.TopBookResponse;
import com.bookstore.bookstore_backend.service.ReportService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminReportController {

    private final ReportService reportService;

    @GetMapping("/dashboard")
    public ResponseEntity<DashboardResponse> getDashboard() {
        return ResponseEntity.ok(reportService.getDashboard());
    }

    @GetMapping("/sales/daily")
    public ResponseEntity<List<DailySalesResponse>> getDailySales(
            @RequestParam(name = "from", required = false)
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate from,
            @RequestParam(name = "to", required = false)
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate to) {
        return ResponseEntity.ok(reportService.getDailySales(from, to));
    }

    @GetMapping("/sales/top-books")
    public ResponseEntity<List<TopBookResponse>> getTopBooks(
            @RequestParam(name = "limit", defaultValue = "5") int limit) {
        return ResponseEntity.ok(reportService.getTopSellingBooks(limit));
    }
}