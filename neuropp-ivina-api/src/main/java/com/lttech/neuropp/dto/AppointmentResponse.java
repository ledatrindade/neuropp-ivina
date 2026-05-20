package com.lttech.neuropp.dto;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.UUID;

import com.lttech.neuropp.entity.Appointment;
import com.lttech.neuropp.enums.AppointmentStatus;

/*
 * DTO de saída do agendamento.
 */
public class AppointmentResponse {

    private UUID id;

    private UUID responsibleId;
    private String responsibleName;
    private String responsiblePhone;

    private UUID childId;
    private String childName;
    private Integer childAge;

    private UUID slotId;
    private LocalDate date;
    private LocalTime startTime;
    private LocalTime endTime;

    private AppointmentStatus status;
    private String notes;

    public static AppointmentResponse fromEntity(Appointment appointment) {
        AppointmentResponse response = new AppointmentResponse();

        response.setId(appointment.getId());

        response.setResponsibleId(appointment.getResponsible().getId());
        response.setResponsibleName(appointment.getResponsible().getName());
        response.setResponsiblePhone(appointment.getResponsible().getPhone());

        response.setChildId(appointment.getChild().getId());
        response.setChildName(appointment.getChild().getName());
        response.setChildAge(appointment.getChild().getAge());

        response.setSlotId(appointment.getSlot().getId());
        response.setDate(appointment.getSlot().getDate());
        response.setStartTime(appointment.getSlot().getStartTime());
        response.setEndTime(appointment.getSlot().getEndTime());

        response.setStatus(appointment.getStatus());
        response.setNotes(appointment.getNotes());

        return response;
    }

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public UUID getResponsibleId() {
        return responsibleId;
    }

    public void setResponsibleId(UUID responsibleId) {
        this.responsibleId = responsibleId;
    }

    public String getResponsibleName() {
        return responsibleName;
    }

    public void setResponsibleName(String responsibleName) {
        this.responsibleName = responsibleName;
    }

    public String getResponsiblePhone() {
        return responsiblePhone;
    }

    public void setResponsiblePhone(String responsiblePhone) {
        this.responsiblePhone = responsiblePhone;
    }

    public UUID getChildId() {
        return childId;
    }

    public void setChildId(UUID childId) {
        this.childId = childId;
    }

    public String getChildName() {
        return childName;
    }

    public void setChildName(String childName) {
        this.childName = childName;
    }

    public Integer getChildAge() {
        return childAge;
    }

    public void setChildAge(Integer childAge) {
        this.childAge = childAge;
    }

    public UUID getSlotId() {
        return slotId;
    }

    public void setSlotId(UUID slotId) {
        this.slotId = slotId;
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

    public AppointmentStatus getStatus() {
        return status;
    }

    public void setStatus(AppointmentStatus status) {
        this.status = status;
    }

   public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }
}