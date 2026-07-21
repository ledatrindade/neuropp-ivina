package com.lttech.neuropp.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record ChangePasswordRequest(
        @NotBlank(message = "A senha atual é obrigatória.")
        @Size(max = 72, message = "A senha atual deve ter no máximo 72 caracteres.")
        String currentPassword,

        @NotBlank(message = "A nova senha é obrigatória.")
        @Size(min = 12, max = 72, message = "A nova senha deve ter entre 12 e 72 caracteres.")
        String newPassword
) {
}
