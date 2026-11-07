package com.bookstore.bookstore_backend.controller;

import com.bookstore.bookstore_backend.dto.response.PageResponse;
import com.bookstore.bookstore_backend.dto.response.UserResponse;
import com.bookstore.bookstore_backend.service.UserService;
import com.bookstore.bookstore_backend.util.PageUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.Set;

@RestController
@RequestMapping("/api/admin/customers")
@RequiredArgsConstructor
public class AdminCustomerController {

    private static final Set<String> ALLOWED_SORT_FIELDS = Set.of("name", "email", "createdAt");

    private final UserService userService;

    @GetMapping
    public ResponseEntity<PageResponse<UserResponse>> getCustomers(
            @RequestParam(name = "keyword", required = false) String keyword,
            @RequestParam(name = "page", defaultValue = "0") int page,
            @RequestParam(name = "size", defaultValue = "10") int size,
            @RequestParam(name = "sortBy", defaultValue = "createdAt") String sortBy,
            @RequestParam(name = "direction", defaultValue = "desc") String direction) {

        Pageable pageable = PageUtil.createPageable(page, size, sortBy, direction, ALLOWED_SORT_FIELDS);
        return ResponseEntity.ok(userService.getCustomers(keyword, pageable));
    }
}