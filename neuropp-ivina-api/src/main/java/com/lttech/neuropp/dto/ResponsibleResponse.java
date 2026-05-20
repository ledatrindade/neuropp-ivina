package com.lttech.neuropp.dto;

import java.util.UUID;

import com.lttech.neuropp.entity.User;
import com.lttech.neuropp.enums.UserRole;

/*
 * DTO de saída do responsável.
 *
 * Não devolvemos passwordHash para o front.
 */
public class ResponsibleResponse {

    private UUID id;
    private String name;
    private String email;
    private String phone;
    private UserRole role;

    public static ResponsibleResponse fromEntity(User user) {
        ResponsibleResponse response = new ResponsibleResponse();

        response.setId(user.getId());
        response.setName(user.getName());
        response.setEmail(user.getEmail());
        response.setPhone(user.getPhone());
        response.setRole(user.getRole());

        return response;
    }

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

   public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

   public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

   public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public UserRole getRole() {
        return role;
    }

    public void setRole(UserRole role) {
        this.role = role;
    }
}