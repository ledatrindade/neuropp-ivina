package com.lttech.neuropp.config;

import jakarta.validation.constraints.NotEmpty;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.validation.annotation.Validated;

import java.util.List;

@Validated
@ConfigurationProperties(prefix = "app.cors")
public record CorsProperties(@NotEmpty List<String> allowedOrigins) {
    public CorsProperties {
        if (allowedOrigins != null && allowedOrigins.stream().anyMatch("*"::equals)) {
            throw new IllegalArgumentException(
                    "Defina origens CORS explícitas; o curinga * não é permitido."
            );
        }
    }
}
