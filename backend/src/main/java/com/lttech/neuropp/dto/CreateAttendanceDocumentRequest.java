package com.lttech.neuropp.dto;

import com.lttech.neuropp.enums.DocumentType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.util.UUID;

public record CreateAttendanceDocumentRequest(
        @NotNull(message = "O ID do agendamento é obrigatório.")
        UUID appointmentId,

        @NotBlank(message = "O título do documento é obrigatório.")
        @Size(max = 180, message = "O título deve ter no máximo 180 caracteres.")
        String title,

        @NotNull(message = "O tipo do documento é obrigatório.")
        DocumentType documentType,

        @Size(max = 100_000, message = "O conteúdo deve ter no máximo 100000 caracteres.")
        String content,

        @Size(max = 2048, message = "A referência do arquivo é muito longa.")
        String fileUrl
) {
}
