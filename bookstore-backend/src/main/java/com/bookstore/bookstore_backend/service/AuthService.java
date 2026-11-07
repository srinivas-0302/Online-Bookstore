package com.bookstore.bookstore_backend.service;

import com.bookstore.bookstore_backend.dto.request.LoginRequest;
import com.bookstore.bookstore_backend.dto.request.RegisterRequest;
import com.bookstore.bookstore_backend.dto.response.AuthResponse;
import com.bookstore.bookstore_backend.dto.response.UserResponse;

public interface AuthService {

    UserResponse register(RegisterRequest request);

    AuthResponse login(LoginRequest request);
}