package com.lttech.neuropp.dto;

import com.lttech.neuropp.enums.AppointmentStatus;
import jakarta.validation.constraints.NotNull;

public record UpdateAppointmentStatusRequest(
        @NotNull(message = "O status é obrigatório.")
        AppointmentStatus status
) {
}
