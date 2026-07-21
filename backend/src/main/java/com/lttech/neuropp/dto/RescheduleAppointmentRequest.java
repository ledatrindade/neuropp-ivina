package com.lttech.neuropp.dto;

import jakarta.validation.constraints.NotNull;

import java.util.UUID;

public record RescheduleAppointmentRequest(
        @NotNull(message = "O novo horário é obrigatório.")
        UUID newSlotId
) {
}
