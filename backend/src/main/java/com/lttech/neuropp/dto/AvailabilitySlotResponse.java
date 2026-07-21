package com.lttech.neuropp.dto;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.UUID;

public record AvailabilitySlotResponse(
        UUID id,
        LocalDate date,
        LocalTime startTime,
        LocalTime endTime,
        Boolean isAvailable,
        Boolean isBlocked
) {
}
