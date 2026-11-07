package com.bookstore.bookstore_backend.util;

import com.bookstore.bookstore_backend.exception.BadRequestException;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;

import java.util.Set;
import java.util.TreeSet;

public final class PageUtil {

    private static final int MAX_PAGE_SIZE = 50;

    private PageUtil() {
        // utility class, no objects needed
    }

    public static Pageable createPageable(int page,
                                          int size,
                                          String sortBy,
                                          String direction,
                                          Set<String> allowedSortFields) {

        if (!allowedSortFields.contains(sortBy)) {
            throw new BadRequestException("Invalid sortBy value '" + sortBy
                    + "'. Allowed values: " + new TreeSet<>(allowedSortFields));
        }

        Sort.Direction sortDirection =
                "desc".equalsIgnoreCase(direction) ? Sort.Direction.DESC : Sort.Direction.ASC;

        int safePage = Math.max(page, 0);
        int safeSize = Math.min(Math.max(size, 1), MAX_PAGE_SIZE);

        return PageRequest.of(safePage, safeSize, Sort.by(sortDirection, sortBy));
    }
}