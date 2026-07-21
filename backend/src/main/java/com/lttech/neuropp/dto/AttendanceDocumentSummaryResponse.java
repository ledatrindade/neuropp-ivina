package com.lttech.neuropp.dto;

import com.lttech.neuropp.enums.DocumentType;

import java.time.Instant;
import java.util.UUID;

public record AttendanceDocumentSummaryResponse(
        UUID id,
        UUID appointmentId,
        UUID responsibleId,
        String responsibleName,
        UUID childId,
        String childName,
        String title,
        DocumentType documentType,
        Boolean isReleased,
        Instant releasedAt,
        Instant createdAt
) {
}
