package com.lttech.neuropp.dto;

import com.lttech.neuropp.enums.UserRole;

import java.util.UUID;

public record ResponsibleResponse(
        UUID id,
        String name,
        String email,
        String phone,
        UserRole role
) {
}
