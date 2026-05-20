package com.lttech.neuropp.controller;

import java.util.List;
import java.util.UUID;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.lttech.neuropp.dto.ChildResponse;
import com.lttech.neuropp.dto.CreateChildRequest;
import com.lttech.neuropp.service.ChildService;

import jakarta.validation.Valid;

/*
 * Controller da criança.
 */
@RestController
@RequestMapping("/api/children")
public class ChildController {

    private final ChildService childService;

    public ChildController(ChildService childService) {
        this.childService = childService;
    }

    /*
     * Cadastra criança vinculada a um responsável.
     *
     * POST http://localhost:8080/api/children
     */
    @PostMapping
    public ChildResponse createChild(
            @Valid @RequestBody CreateChildRequest request
    ) {
        return childService.createChild(request);
    }

    /*
     * Lista crianças de um responsável.
     *
     * GET http://localhost:8080/api/children/responsible/{responsibleId}
     */
    @GetMapping("/responsible/{responsibleId}")
    public List<ChildResponse> listChildrenByResponsible(
            @PathVariable UUID responsibleId
    ) {
        return childService.listChildrenByResponsible(responsibleId);
    }
}