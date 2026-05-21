package com.lttech.neuropp.dto;

import java.time.LocalDateTime;
import java.util.UUID;

import com.lttech.neuropp.entity.AttendanceDocument;
import com.lttech.neuropp.enums.DocumentType;

/*
 * DTO de saída dos documentos privados.
 *
 * É o formato que a API devolve para o front-end.
 */
public class AttendanceDocumentResponse {

    private UUID id;

    private UUID appointmentId;

    private UUID responsibleId;
    private String responsibleName;

    private UUID childId;
    private String childName;

    private String title;
    private DocumentType documentType;
    private String content;
    private String fileUrl;

    private Boolean isReleased;
    private LocalDateTime releasedAt;
    private LocalDateTime createdAt;

    public static AttendanceDocumentResponse fromEntity(AttendanceDocument document) {
        AttendanceDocumentResponse response = new AttendanceDocumentResponse();

        response.setId(document.getId());

        response.setAppointmentId(document.getAppointment().getId());

        response.setResponsibleId(document.getResponsible().getId());
        response.setResponsibleName(document.getResponsible().getName());

        response.setChildId(document.getChild().getId());
        response.setChildName(document.getChild().getName());

        response.setTitle(document.getTitle());
        response.setDocumentType(document.getDocumentType());
        response.setContent(document.getContent());
        response.setFileUrl(document.getFileUrl());

        response.setIsReleased(document.getIsReleased());
        response.setReleasedAt(document.getReleasedAt());
        response.setCreatedAt(document.getCreatedAt());

        return response;
    }

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public UUID getAppointmentId() {
        return appointmentId;
    }

    public void setAppointmentId(UUID appointmentId) {
        this.appointmentId = appointmentId;
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

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public DocumentType getDocumentType() {
        return documentType;
    }

    public void setDocumentType(DocumentType documentType) {
        this.documentType = documentType;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }
  
    public String getFileUrl() {
        return fileUrl;
    }

    public void setFileUrl(String fileUrl) {
        this.fileUrl = fileUrl;
    }

    public Boolean getIsReleased() {
        return isReleased;
    }

    public void setIsReleased(Boolean released) {
        isReleased = released;
    }

    public LocalDateTime getReleasedAt() {
        return releasedAt;
    }

    public void setReleasedAt(LocalDateTime releasedAt) {
        this.releasedAt = releasedAt;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}