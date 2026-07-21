package com.lttech.neuropp.controller;

import com.lttech.neuropp.dto.CreateResponsibleRequest;
import com.lttech.neuropp.dto.ResponsibleResponse;
import com.lttech.neuropp.service.ResponsibleService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/responsibles")
public class ResponsibleController {

    private final ResponsibleService responsibleService;

    public ResponsibleController(ResponsibleService responsibleService) {
        this.responsibleService = responsibleService;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ResponsibleResponse createResponsible(
            @Valid @RequestBody CreateResponsibleRequest request
    ) {
        return responsibleService.createResponsible(request);
    }
}
