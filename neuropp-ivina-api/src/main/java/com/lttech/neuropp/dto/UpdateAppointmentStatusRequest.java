package com.lttech.neuropp.dto;

import com.lttech.neuropp.enums.AppointmentStatus;
import jakarta.validation.constraints.NotNull;

/*
 * DTO usado pela administradora para alterar o status do atendimento.
 *
 * Exemplo:
 * {
 *   "status": "ATTENDED"
 * }
 */
public class UpdateAppointmentStatusRequest {

    @NotNull(message = "O status é obrigatório.")
    private AppointmentStatus status;

    public AppointmentStatus getStatus() {
        return status;
    }

    public void setStatus(AppointmentStatus status) {
        this.status = status;
    }
}