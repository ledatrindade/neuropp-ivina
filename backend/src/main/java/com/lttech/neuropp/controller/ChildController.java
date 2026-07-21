package com.lttech.neuropp.controller;

import com.lttech.neuropp.dto.ChildResponse;
import com.lttech.neuropp.dto.CreateMyChildRequest;
import com.lttech.neuropp.security.AuthenticatedUserService;
import com.lttech.neuropp.service.ChildService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

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

    @PostMapping("/my")
    @ResponseStatus(HttpStatus.CREATED)
    public ChildResponse createMyChild(@Valid @RequestBody CreateMyChildRequest request) {
        UUID responsibleId = authenticatedUserService.getAuthenticatedUserId();
        return childService.createChildForResponsible(responsibleId, request);
    }

    @GetMapping("/my")
    public List<ChildResponse> listMyChildren() {
        UUID responsibleId = authenticatedUserService.getAuthenticatedUserId();
        return childService.listChildrenByResponsible(responsibleId);
    }
}
