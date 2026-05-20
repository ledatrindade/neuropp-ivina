package com.lttech.neuropp.dto;

import jakarta.validation.constraints.NotNull;

import java.util.UUID;

/*
 * DTO usado quando o responsável deseja reagendar um atendimento.
 *
 * Ele informa qual será o novo horário escolhido.
 */
public class RescheduleAppointmentRequest {

    @NotNull(message = "O novo horário é obrigatório.")
    private UUID newSlotId;

    public UUID getNewSlotId() {
        return newSlotId;
    }

    public void setNewSlotId(UUID newSlotId) {
        this.newSlotId = newSlotId;
    }
}