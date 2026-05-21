package com.lttech.neuropp.dto;

import java.util.UUID;

import com.lttech.neuropp.enums.UserRole;

/*
 * DTO de saída do login.
 *
 * Devolve o token e algumas informações úteis do usuário.
 */
public class LoginResponse {

    private String token;
    private String tokenType = "Bearer";

    private UUID userId;
    private String name;
    private String email;
    private UserRole role;

    public LoginResponse() {
    }

    public LoginResponse(String token, UUID userId, String name, String email, UserRole role) {
        this.token = token;
        this.userId = userId;
        this.name = name;
        this.email = email;
        this.role = role;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }
  
    public String getTokenType() {
        return tokenType;
    }

    public void setTokenType(String tokenType) {
        this.tokenType = tokenType;
    }

    public UUID getUserId() {
        return userId;
    }

    public void setUserId(UUID userId) {
        this.userId = userId;
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
  
    public UserRole getRole() {
        return role;
    }

    public void setRole(UserRole role) {
        this.role = role;
    }
}