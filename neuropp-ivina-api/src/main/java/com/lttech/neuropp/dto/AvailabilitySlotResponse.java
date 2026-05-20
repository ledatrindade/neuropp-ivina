package com.lttech.neuropp.dto;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.UUID;

import com.lttech.neuropp.entity.AvailabilitySlot;

/*
 * DTO de saída.
 *
 * Esse arquivo define como a API devolve um horário para o front-end.
 *
 * A gente evita devolver a Entity diretamente porque a Entity representa
 * o banco de dados, e nem sempre queremos expor tudo para o front.
 */
public class AvailabilitySlotResponse {

    private UUID id;
    private LocalDate date;
    private LocalTime startTime;
    private LocalTime endTime;
    private Boolean isAvailable;
    private Boolean isBlocked;

    /*
     * Método auxiliar que transforma uma Entity em Response.
     */
    public static AvailabilitySlotResponse fromEntity(AvailabilitySlot slot) {
        AvailabilitySlotResponse response = new AvailabilitySlotResponse();

        response.setId(slot.getId());
        response.setDate(slot.getDate());
        response.setStartTime(slot.getStartTime());
        response.setEndTime(slot.getEndTime());
        response.setIsAvailable(slot.getIsAvailable());
        response.setIsBlocked(slot.getIsBlocked());

        return response;
    }

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

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

    public Boolean getIsAvailable() {
        return isAvailable;
    }

    public void setIsAvailable(Boolean available) {
        isAvailable = available;
    }

    public Boolean getIsBlocked() {
        return isBlocked;
    }

    public void setIsBlocked(Boolean blocked) {
        isBlocked = blocked;
    }
}