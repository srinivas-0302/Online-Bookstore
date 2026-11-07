package com.bookstore.bookstore_backend.service;

import com.bookstore.bookstore_backend.dto.request.ChangePasswordRequest;
import com.bookstore.bookstore_backend.dto.request.UpdateProfileRequest;
import com.bookstore.bookstore_backend.dto.response.PageResponse;
import com.bookstore.bookstore_backend.dto.response.UserResponse;
import org.springframework.data.domain.Pageable;

public interface UserService {

    UserResponse getProfile(String email);

    UserResponse updateProfile(String email, UpdateProfileRequest request);

    void changePassword(String email, ChangePasswordRequest request);

    PageResponse<UserResponse> getCustomers(String keyword, Pageable pageable);
}