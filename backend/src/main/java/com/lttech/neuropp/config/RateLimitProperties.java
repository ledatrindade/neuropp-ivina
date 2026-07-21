package com.lttech.neuropp.config;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.validation.annotation.Validated;

import java.time.Duration;

@Validated
@ConfigurationProperties(prefix = "app.rate-limit")
public record RateLimitProperties(
        @Min(1) int loginMaxRequests,
        @NotNull Duration loginWindow,
        @Min(1) int registrationMaxRequests,
        @NotNull Duration registrationWindow
) {
}
