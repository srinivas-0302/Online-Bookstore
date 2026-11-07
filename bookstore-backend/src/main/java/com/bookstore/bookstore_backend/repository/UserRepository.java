package com.bookstore.bookstore_backend.repository;

import com.bookstore.bookstore_backend.entity.User;
import com.bookstore.bookstore_backend.enums.Role;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {

    // ----- From Step 7 (login and register) -----
    Optional<User> findByEmail(String email);

    boolean existsByEmail(String email);

    // ----- New in Step 10 (admin customers list and dashboard) -----
    long countByRole(Role role);

    Page<User> findByRole(Role role, Pageable pageable);

    @Query("""
            SELECT u FROM User u
            WHERE u.role = :role
              AND (   LOWER(u.name)  LIKE LOWER(CONCAT('%', :keyword, '%'))
                   OR LOWER(u.email) LIKE LOWER(CONCAT('%', :keyword, '%')) )
            """)
    Page<User> searchByRole(@Param("role") Role role,
                            @Param("keyword") String keyword,
                            Pageable pageable);
}