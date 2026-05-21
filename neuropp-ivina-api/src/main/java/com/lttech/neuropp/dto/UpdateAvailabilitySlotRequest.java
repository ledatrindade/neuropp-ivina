package com.lttech.neuropp.dto;

import java.time.LocalDate;
import java.time.LocalTime;

import jakarta.validation.constraints.NotNull;

/*
 * DTO usado quando a administradora edita um horário.
 *
 * Exemplo:
 * {
 *   "date": "2026-06-20",
 *   "startTime": "09:00",
 *   "endTime": "12:00"
 * }
 */
public class UpdateAvailabilitySlotRequest {

    @NotNull(message = "A data é obrigatória.")
    private LocalDate date;

    @NotNull(message = "O horário inicial é obrigatório.")
    private LocalTime startTime;

    @NotNull(message = "O horário final é obrigatório.")
    private LocalTime endTime;

    public LocalDate getDate() {
        return date;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }

    public LocalTime getStartTime() {
        return startTime;
    }

    public void setStartTime(LocalTime startTime) {
        this.startTime = startTime;
    }

    public LocalTime getEndTime() {
        return endTime;
    }

    public void setEndTime(LocalTime endTime) {
        this.endTime = endTime;
    }
}