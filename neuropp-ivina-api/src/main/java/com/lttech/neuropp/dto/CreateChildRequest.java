package com.lttech.neuropp.dto;

import java.util.UUID;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

/*
 * DTO usado para cadastrar uma criança vinculada a um responsável.
 */
public class CreateChildRequest {

    @NotBlank(message = "O nome da criança é obrigatório.")
    private String name;

    @NotNull(message = "A idade da criança é obrigatória.")
    @Min(value = 0, message = "A idade não pode ser negativa.")
    @Max(value = 17, message = "Para este sistema inicial, a idade máxima permitida é 17 anos.")
    private Integer age;

    @NotNull(message = "O ID do responsável é obrigatório.")
    private UUID responsibleId;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

   public Integer getAge() {
        return age;
    }

    public void setAge(Integer age) {
        this.age = age;
    }

   public UUID getResponsibleId() {
        return responsibleId;
    }

    public void setResponsibleId(UUID responsibleId) {
        this.responsibleId = responsibleId;
    }
}