package com.lttech.neuropp.controller;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.lttech.neuropp.dto.CreateResponsibleRequest;
import com.lttech.neuropp.dto.ResponsibleResponse;
import com.lttech.neuropp.service.ResponsibleService;

import jakarta.validation.Valid;

/*
 * Controller do responsável.
 */
@RestController
@RequestMapping("/api/responsibles")
public class ResponsibleController {

    private final ResponsibleService responsibleService;

    public ResponsibleController(ResponsibleService responsibleService) {
        this.responsibleService = responsibleService;
    }

    /*
     * Cria um responsável.
     *
     * POST http://localhost:8080/api/responsibles
     */
    @PostMapping
    public ResponsibleResponse createResponsible(
            @Valid @RequestBody CreateResponsibleRequest request
    ) {
        return responsibleService.createResponsible(request);
    }
}