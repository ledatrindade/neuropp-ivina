package com.lttech.neuropp.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

/*
 * DTO usado quando o responsável logado cadastra uma criança.
 *
 * Aqui não existe responsibleId porque o back-end pega o responsável pelo token.
 */
public class CreateMyChildRequest {

    @NotBlank(message = "O nome da criança é obrigatório.")
    private String name;

    @NotNull(message = "A idade da criança é obrigatória.")
    @Min(value = 0, message = "A idade não pode ser negativa.")
    @Max(value = 17, message = "Para este sistema inicial, a idade máxima permitida é 17 anos.")
    private Integer age;

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
}