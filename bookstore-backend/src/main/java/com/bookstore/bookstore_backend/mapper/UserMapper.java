package com.bookstore.bookstore_backend.mapper;

import com.bookstore.bookstore_backend.dto.response.UserResponse;
import com.bookstore.bookstore_backend.entity.User;
import org.springframework.stereotype.Component;

@Component
public class UserMapper {

    public UserResponse toResponse(User user) {
        return new UserResponse(
                user.getUserId(),
                user.getName(),
                user.getEmail(),
                user.getPhone(),
                user.getRole().name(),
                user.getCreatedAt()
        );
    }
}