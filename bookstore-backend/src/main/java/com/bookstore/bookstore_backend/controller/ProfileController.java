package com.bookstore.bookstore_backend.controller;

import com.bookstore.bookstore_backend.dto.request.ChangePasswordRequest;
import com.bookstore.bookstore_backend.dto.request.UpdateProfileRequest;
import com.bookstore.bookstore_backend.dto.response.UserResponse;
import com.bookstore.bookstore_backend.security.CustomUserDetails;
import com.bookstore.bookstore_backend.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/profile")
@RequiredArgsConstructor
public class ProfileController {

    private final UserService userService;

    @GetMapping
    public ResponseEntity<UserResponse> getMyProfile(@AuthenticationPrincipal CustomUserDetails principal) {
        return ResponseEntity.ok(userService.getProfile(principal.getUsername()));
    }

    @PutMapping
    public ResponseEntity<UserResponse> updateMyProfile(@AuthenticationPrincipal CustomUserDetails principal,
                                                        @Valid @RequestBody UpdateProfileRequest request) {
        return ResponseEntity.ok(userService.updateProfile(principal.getUsername(), request));
    }

    @PutMapping("/password")
    public ResponseEntity<Void> changePassword(@AuthenticationPrincipal CustomUserDetails principal,
                                               @Valid @RequestBody ChangePasswordRequest request) {
        userService.changePassword(principal.getUsername(), request);
        return ResponseEntity.noContent().build();
    }
}