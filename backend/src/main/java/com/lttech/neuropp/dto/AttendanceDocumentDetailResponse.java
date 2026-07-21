package com.lttech.neuropp.dto;

import com.lttech.neuropp.enums.DocumentType;

import java.time.Instant;
import java.util.UUID;

public record AttendanceDocumentDetailResponse(
        UUID id,
        UUID appointmentId,
        UUID responsibleId,
        String responsibleName,
        UUID childId,
        String childName,
        String title,
        DocumentType documentType,
        String content,
        String fileUrl,
        Boolean isReleased,
        Instant releasedAt,
        Instant createdAt,
        Instant updatedAt
) {
}
