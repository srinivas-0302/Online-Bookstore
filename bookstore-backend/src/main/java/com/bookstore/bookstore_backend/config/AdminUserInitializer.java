package com.bookstore.bookstore_backend.config;

import com.bookstore.bookstore_backend.entity.User;
import com.bookstore.bookstore_backend.enums.Role;
import com.bookstore.bookstore_backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class AdminUserInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Value("${app.admin.name}")
    private String adminName;

    @Value("${app.admin.email}")
    private String adminEmail;

    @Value("${app.admin.password}")
    private String adminPassword;

    @Override
    public void run(String... args) {
        String email = adminEmail.trim().toLowerCase();

        if (userRepository.existsByEmail(email)) {
            return;
        }

        User admin = User.builder()
                .name(adminName)
                .email(email)
                .password(passwordEncoder.encode(adminPassword))
                .role(Role.ADMIN)
                .build();

        userRepository.save(admin);
        log.info("Default admin user created with email: {}", email);
    }
}