package com.lttech.neuropp.dto;

import com.lttech.neuropp.enums.AppointmentStatus;

import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.UUID;

public record AppointmentResponse(
        UUID id,
        UUID responsibleId,
        String responsibleName,
        String responsiblePhone,
        UUID childId,
        String childName,
        Integer childAge,
        UUID slotId,
        LocalDate date,
        LocalTime startTime,
        LocalTime endTime,
        AppointmentStatus status,
        String notes,
        Instant createdAt,
        Instant updatedAt
) {
}
