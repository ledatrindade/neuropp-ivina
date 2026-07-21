package com.lttech.neuropp.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record CreateMyChildRequest(
        @NotBlank(message = "O nome da criança é obrigatório.")
        @Size(min = 2, max = 150, message = "O nome deve ter entre 2 e 150 caracteres.")
        String name,

        @NotNull(message = "A idade da criança é obrigatória.")
        @Min(value = 0, message = "A idade não pode ser negativa.")
        @Max(value = 17, message = "A idade máxima permitida é 17 anos.")
        Integer age
) {
}
