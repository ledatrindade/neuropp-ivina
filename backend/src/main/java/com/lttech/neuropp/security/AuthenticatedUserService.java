package com.lttech.neuropp.security;

import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public class AuthenticatedUserService {

    public UUID getAuthenticatedUserId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null
                || !authentication.isAuthenticated()
                || authentication instanceof AnonymousAuthenticationToken) {
            throw new IllegalStateException("Usuário não autenticado.");
        }

        try {
            return UUID.fromString(authentication.getName());
        } catch (IllegalArgumentException exception) {
            throw new IllegalStateException("Identidade autenticada inválida.");
        }
    }
}
