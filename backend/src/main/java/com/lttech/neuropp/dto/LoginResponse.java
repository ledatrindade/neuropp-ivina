package com.lttech.neuropp.dto;

import com.lttech.neuropp.enums.UserRole;

import java.time.Instant;
import java.util.UUID;

public record LoginResponse(
        String token,
        String tokenType,
        Instant expiresAt,
        UUID userId,
        String name,
        String email,
        UserRole role
) {
}
