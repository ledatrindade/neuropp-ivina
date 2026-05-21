package com.lttech.neuropp.dto;

import java.util.UUID;

import jakarta.validation.constraints.NotNull;

/*
 * DTO usado quando o responsável logado cria um agendamento.
 *
 * Não existe responsibleId aqui.
 * O responsável vem do token.
 */
public class CreateMyAppointmentRequest {

    @NotNull(message = "O ID da criança é obrigatório.")
    private UUID childId;

    @NotNull(message = "O ID do horário é obrigatório.")
    private UUID slotId;

    private String notes;

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