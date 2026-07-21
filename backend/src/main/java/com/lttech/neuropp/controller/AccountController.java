package com.lttech.neuropp.controller;

import com.lttech.neuropp.dto.ChangePasswordRequest;
import com.lttech.neuropp.security.AuthenticatedUserService;
import com.lttech.neuropp.service.AccountService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import java.util.UUID;

@RestController
@RequestMapping("/api/account")
public class AccountController {

    private final AccountService accountService;
    private final AuthenticatedUserService authenticatedUserService;

    public AccountController(
            AccountService accountService,
            AuthenticatedUserService authenticatedUserService
    ) {
        this.accountService = accountService;
        this.authenticatedUserService = authenticatedUserService;
    }

    @PutMapping("/password")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void changePassword(@Valid @RequestBody ChangePasswordRequest request) {
        UUID userId = authenticatedUserService.getAuthenticatedUserId();
        accountService.changePassword(userId, request);
    }
}
