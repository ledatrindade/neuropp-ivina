package com.lttech.neuropp.dto;

import java.util.UUID;

import com.lttech.neuropp.enums.DocumentType;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

/*
 * DTO usado quando Ivina cria um documento privado.
 *
 * No MVP, o conteúdo será escrito diretamente no sistema.
 * Futuramente poderemos usar fileUrl para upload de PDF.
 */
public class CreateAttendanceDocumentRequest {

    @NotNull(message = "O ID do agendamento é obrigatório.")
    private UUID appointmentId;

    @NotBlank(message = "O título do documento é obrigatório.")
    private String title;

    @NotNull(message = "O tipo do documento é obrigatório.")
    private DocumentType documentType;

    private String content;

    private String fileUrl;

    public UUID getAppointmentId() {
        return appointmentId;
    }

    public void setAppointmentId(UUID appointmentId) {
        this.appointmentId = appointmentId;
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
}