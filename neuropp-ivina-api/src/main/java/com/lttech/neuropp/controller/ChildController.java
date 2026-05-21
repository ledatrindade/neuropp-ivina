package com.lttech.neuropp.controller;

import java.util.List;
import java.util.UUID;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.lttech.neuropp.dto.ChildResponse;
import com.lttech.neuropp.dto.CreateMyChildRequest;
import com.lttech.neuropp.security.AuthenticatedUserService;
import com.lttech.neuropp.service.ChildService;

import jakarta.validation.Valid;

/*
 * Controller da criança.
 *
 * Nesta versão, priorizamos rotas seguras usando o usuário autenticado.
 */
@RestController
@RequestMapping("/api/children")
public class ChildController {

    private final ChildService childService;
    private final AuthenticatedUserService authenticatedUserService;

    public ChildController(
            ChildService childService,
            AuthenticatedUserService authenticatedUserService
    ) {
        this.childService = childService;
        this.authenticatedUserService = authenticatedUserService;
    }

    /*
     * Responsável logado cadastra uma criança.
     *
     * POST http://localhost:8080/api/children/my
     *
     * O responsável vem do token.
     */
    @PostMapping("/my")
    public ChildResponse createMyChild(
            @Valid @RequestBody CreateMyChildRequest request
    ) {
        UUID responsibleId = authenticatedUserService.getAuthenticatedUserId();

        return childService.createChildForResponsible(responsibleId, request);
    }

    /*
     * Responsável logado lista suas próprias crianças.
     *
     * GET http://localhost:8080/api/children/my
     */
    @GetMapping("/my")
    public List<ChildResponse> listMyChildren() {
        UUID responsibleId = authenticatedUserService.getAuthenticatedUserId();

        return childService.listChildrenByResponsible(responsibleId);
    }
}