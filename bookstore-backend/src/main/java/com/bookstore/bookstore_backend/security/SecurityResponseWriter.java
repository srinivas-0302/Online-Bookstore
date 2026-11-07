package com.bookstore.bookstore_backend.security;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;

final class SecurityResponseWriter {

    private SecurityResponseWriter() {
    }

    static void write(HttpServletRequest request,
                      HttpServletResponse response,
                      HttpStatus status,
                      String message) throws IOException {

        String json = """
                {"timestamp":"%s","status":%d,"error":"%s","message":"%s","path":"%s"}
                """.formatted(
                LocalDateTime.now(),
                status.value(),
                status.getReasonPhrase(),
                message,
                escape(request.getRequestURI()));

        response.setStatus(status.value());
        response.setContentType(MediaType.APPLICATION_JSON_VALUE);
        response.setCharacterEncoding(StandardCharsets.UTF_8.name());
        response.getWriter().write(json);
    }

    private static String escape(String value) {
        return value.replace("\\", "\\\\").replace("\"", "\\\"");
    }
}