package com.lttech.neuropp.controller;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.lttech.neuropp.dto.LoginRequest;
import com.lttech.neuropp.dto.LoginResponse;
import com.lttech.neuropp.service.AuthService;

import jakarta.validation.Valid;

/*
 * Controller de autenticação.
 */
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    /*
     * Login do responsável ou admin.
     *
     * POST http://localhost:8080/api/auth/login
     */
    @PostMapping("/login")
    public LoginResponse login(
            @Valid @RequestBody LoginRequest request
    ) {
        return authService.login(request);
    }
}