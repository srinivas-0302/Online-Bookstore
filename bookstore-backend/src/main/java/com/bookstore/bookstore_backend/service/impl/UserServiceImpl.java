package com.bookstore.bookstore_backend.service.impl;

import com.bookstore.bookstore_backend.dto.request.ChangePasswordRequest;
import com.bookstore.bookstore_backend.dto.request.UpdateProfileRequest;
import com.bookstore.bookstore_backend.dto.response.PageResponse;
import com.bookstore.bookstore_backend.dto.response.UserResponse;
import com.bookstore.bookstore_backend.entity.User;
import com.bookstore.bookstore_backend.enums.Role;
import com.bookstore.bookstore_backend.exception.BadRequestException;
import com.bookstore.bookstore_backend.exception.ResourceNotFoundException;
import com.bookstore.bookstore_backend.mapper.UserMapper;
import com.bookstore.bookstore_backend.repository.UserRepository;
import com.bookstore.bookstore_backend.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;

    @Override
    public UserResponse getProfile(String email) {
        return userMapper.toResponse(findUserOrThrow(email));
    }

    @Override
    @Transactional
    public UserResponse updateProfile(String email, UpdateProfileRequest request) {
        User user = findUserOrThrow(email);

        user.setName(request.name().trim());
        user.setPhone(request.phone());      // null clears the phone number

        // No save() needed. Dirty checking updates the row when the transaction ends.
        return userMapper.toResponse(user);
    }

    @Override
    @Transactional
    public void changePassword(String email, ChangePasswordRequest request) {
        User user = findUserOrThrow(email);

        if (!request.newPassword().equals(request.confirmPassword())) {
            throw new BadRequestException("New password and confirm password do not match");
        }

        if (!passwordEncoder.matches(request.currentPassword(), user.getPassword())) {
            throw new BadRequestException("Current password is incorrect");
        }

        if (passwordEncoder.matches(request.newPassword(), user.getPassword())) {
            throw new BadRequestException("New password must be different from the current password");
        }

        user.setPassword(passwordEncoder.encode(request.newPassword()));
    }

    @Override
    public PageResponse<UserResponse> getCustomers(String keyword, Pageable pageable) {
        Page<User> page;

        if (keyword == null || keyword.isBlank()) {
            page = userRepository.findByRole(Role.CUSTOMER, pageable);
        } else {
            page = userRepository.searchByRole(Role.CUSTOMER, keyword.trim(), pageable);
        }

        return PageResponse.from(page.map(userMapper::toResponse));
    }

    // ----- private helper -----
    private User findUserOrThrow(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }
}