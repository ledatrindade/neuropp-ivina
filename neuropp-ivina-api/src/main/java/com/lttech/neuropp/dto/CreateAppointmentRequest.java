package com.lttech.neuropp.dto;

import java.util.UUID;

import jakarta.validation.constraints.NotNull;

/*
 * DTO usado para criar um agendamento.
 *
 * Por enquanto usamos IDs no Postman.
 * Depois, com login, o responsibleId virá automaticamente pelo token.
 */
public class CreateAppointmentRequest {

    @NotNull(message = "O ID do responsável é obrigatório.")
    private UUID responsibleId;

    @NotNull(message = "O ID da criança é obrigatório.")
    private UUID childId;

    @NotNull(message = "O ID do horário é obrigatório.")
    private UUID slotId;

    private String notes;

    public UUID getResponsibleId() {
        return responsibleId;
    }

    public void setResponsibleId(UUID responsibleId) {
        this.responsibleId = responsibleId;
    }

    public UUID getChildId() {
        return childId;
    }

    public void setChildId(UUID childId) {
        this.childId = childId;
    }

    public UUID getSlotId() {
        return slotId;
    }

    public void setSlotId(UUID slotId) {
        this.slotId = slotId;
    }

   public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }
}