package com.lttech.neuropp.security;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.lttech.neuropp.config.RateLimitProperties;
import com.lttech.neuropp.dto.ApiErrorResponse;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.time.Duration;
import java.time.Instant;
import java.util.ArrayDeque;
import java.util.Deque;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicLong;

@Component
public class RateLimitFilter extends OncePerRequestFilter {

    private final RateLimitProperties properties;
    private final ObjectMapper objectMapper;
    private final Map<String, Deque<Instant>> attempts = new ConcurrentHashMap<>();
    private final AtomicLong requestCounter = new AtomicLong();

    public RateLimitFilter(RateLimitProperties properties, ObjectMapper objectMapper) {
        this.properties = properties;
        this.objectMapper = objectMapper;
    }

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain
    ) throws ServletException, IOException {
        cleanupExpiredEntriesPeriodically();
        LimitRule rule = resolveRule(request);

        if (rule == null) {
            filterChain.doFilter(request, response);
            return;
        }

        String key = request.getRequestURI() + ":" + request.getRemoteAddr();
        Instant now = Instant.now();

        if (!tryConsume(key, rule.maxRequests(), rule.window(), now)) {
            response.setStatus(HttpStatus.TOO_MANY_REQUESTS.value());
            response.setContentType(MediaType.APPLICATION_JSON_VALUE);
            response.setCharacterEncoding("UTF-8");
            response.setHeader("Retry-After", String.valueOf(rule.window().toSeconds()));

            String requestId = String.valueOf(request.getAttribute(RequestIdFilter.REQUEST_ID_ATTRIBUTE));
            ApiErrorResponse body = ApiErrorResponse.of(
                    HttpStatus.TOO_MANY_REQUESTS.value(),
                    "Too Many Requests",
                    "RATE_LIMIT_EXCEEDED",
                    "Muitas tentativas. Aguarde um pouco antes de tentar novamente.",
                    request.getRequestURI(),
                    requestId
            );

            objectMapper.writeValue(response.getOutputStream(), body);
            return;
        }

        filterChain.doFilter(request, response);
    }

    private LimitRule resolveRule(HttpServletRequest request) {
        if (!HttpMethod.POST.name().equals(request.getMethod())) {
            return null;
        }

        return switch (request.getRequestURI()) {
            case "/api/auth/login" -> new LimitRule(
                    properties.loginMaxRequests(),
                    properties.loginWindow()
            );
            case "/api/responsibles" -> new LimitRule(
                    properties.registrationMaxRequests(),
                    properties.registrationWindow()
            );
            default -> null;
        };
    }

    private void cleanupExpiredEntriesPeriodically() {
        if (requestCounter.incrementAndGet() % 100 != 0) {
            return;
        }

        Duration longestWindow = properties.loginWindow().compareTo(properties.registrationWindow()) >= 0
                ? properties.loginWindow()
                : properties.registrationWindow();
        Instant cutoff = Instant.now().minus(longestWindow);

        attempts.entrySet().removeIf(entry -> {
            Deque<Instant> timestamps = entry.getValue();
            synchronized (timestamps) {
                return timestamps.isEmpty() || timestamps.peekLast().isBefore(cutoff);
            }
        });
    }

    private boolean tryConsume(String key, int maxRequests, Duration window, Instant now) {
        Deque<Instant> timestamps = attempts.computeIfAbsent(key, ignored -> new ArrayDeque<>());
        Instant cutoff = now.minus(window);

        synchronized (timestamps) {
            while (!timestamps.isEmpty() && timestamps.peekFirst().isBefore(cutoff)) {
                timestamps.removeFirst();
            }

            if (timestamps.size() >= maxRequests) {
                return false;
            }

            timestamps.addLast(now);
            return true;
        }
    }

    private record LimitRule(int maxRequests, Duration window) {
    }
}
