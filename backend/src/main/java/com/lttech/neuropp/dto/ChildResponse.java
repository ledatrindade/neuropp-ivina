package com.lttech.neuropp.dto;

import java.util.UUID;

public record ChildResponse(
        UUID id,
        String name,
        Integer age,
        UUID responsibleId,
        String responsibleName
) {
}
