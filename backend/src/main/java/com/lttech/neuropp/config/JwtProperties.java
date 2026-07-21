package com.lttech.neuropp.config;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.validation.annotation.Validated;

import java.time.Duration;

@Validated
@ConfigurationProperties(prefix = "app.jwt")
public record JwtProperties(
        @NotBlank @Size(min = 32) String secret,
        @NotBlank String issuer,
        @NotBlank String audience,
        @NotNull Duration accessTokenTtl
) {
    public JwtProperties {
        if (accessTokenTtl != null
                && (accessTokenTtl.isZero()
                || accessTokenTtl.isNegative()
                || accessTokenTtl.compareTo(Duration.ofHours(24)) > 0)) {
            throw new IllegalArgumentException(
                    "O tempo de expiração do token deve ser maior que zero e de no máximo 24 horas."
            );
        }
    }
}
