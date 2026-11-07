package com.bookstore.bookstore_backend.service.impl;

import com.bookstore.bookstore_backend.dto.request.LoginRequest;
import com.bookstore.bookstore_backend.dto.request.RegisterRequest;
import com.bookstore.bookstore_backend.dto.response.AuthResponse;
import com.bookstore.bookstore_backend.dto.response.UserResponse;
import com.bookstore.bookstore_backend.entity.User;
import com.bookstore.bookstore_backend.enums.Role;
import com.bookstore.bookstore_backend.exception.ConflictException;
import com.bookstore.bookstore_backend.mapper.UserMapper;
import com.bookstore.bookstore_backend.repository.UserRepository;
import com.bookstore.bookstore_backend.security.CustomUserDetails;
import com.bookstore.bookstore_backend.security.JwtService;
import com.bookstore.bookstore_backend.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    private final UserMapper userMapper;

    @Override
    @Transactional
    public UserResponse register(RegisterRequest request) {
        String email = request.email().trim().toLowerCase();

        if (userRepository.existsByEmail(email)) {
            throw new ConflictException("An account already exists with email: " + email);
        }

        User user = User.builder()
                .name(request.name().trim())
                .email(email)
                .password(passwordEncoder.encode(request.password()))   // BCrypt hash
                .phone(request.phone())
                .role(Role.CUSTOMER)                                    // always CUSTOMER
                .build();

        return userMapper.toResponse(userRepository.save(user));
    }

    @Override
    public AuthResponse login(LoginRequest request) {
        String email = request.email().trim().toLowerCase();

        // Throws BadCredentialsException if email or password is wrong
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(email, request.password()));

        CustomUserDetails principal = (CustomUserDetails) authentication.getPrincipal();
        String token = jwtService.generateToken(principal);

        return new AuthResponse(
                token,
                "Bearer",
                principal.getUserId(),
                principal.getName(),
                principal.getUsername(),
                principal.getRole().name());
    }
}