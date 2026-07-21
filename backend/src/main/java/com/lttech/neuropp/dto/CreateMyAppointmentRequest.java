package com.lttech.neuropp.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.util.UUID;

public record CreateMyAppointmentRequest(
        @NotNull(message = "O ID da criança é obrigatório.")
        UUID childId,

        @NotNull(message = "O ID do horário é obrigatório.")
        UUID slotId,

        @Size(max = 2000, message = "As observações devem ter no máximo 2000 caracteres.")
        String notes
) {
}
