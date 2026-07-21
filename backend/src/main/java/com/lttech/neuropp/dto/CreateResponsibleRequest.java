package com.lttech.neuropp.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record CreateResponsibleRequest(
        @NotBlank(message = "O nome completo é obrigatório.")
        @Size(min = 3, max = 150, message = "O nome deve ter entre 3 e 150 caracteres.")
        String name,

        @NotBlank(message = "O e-mail é obrigatório.")
        @Email(message = "Informe um e-mail válido.")
        @Size(max = 254, message = "O e-mail é muito longo.")
        String email,

        @NotBlank(message = "O WhatsApp é obrigatório.")
        @Pattern(
                regexp = "^\\+?[1-9]\\d{9,14}$",
                message = "Informe o telefone somente com números e, opcionalmente, o código do país com +."
        )
        String phone,

        @NotBlank(message = "A senha é obrigatória.")
        @Size(min = 12, max = 72, message = "A senha deve ter entre 12 e 72 caracteres.")
        String password
) {
}
