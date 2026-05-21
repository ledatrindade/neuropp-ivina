package com.lttech.neuropp.security;

import java.util.UUID;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

/*
 * Serviço auxiliar para descobrir quem está logado.
 *
 * No nosso JwtAuthenticationFilter, colocamos o userId como "principal".
 * Então aqui recuperamos esse ID do token.
 */
@Service
public class AuthenticatedUserService {

    public UUID getAuthenticatedUserId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null || authentication.getPrincipal() == null) {
            throw new IllegalArgumentException("Usuário não autenticado.");
        }

        return UUID.fromString(authentication.getPrincipal().toString());
    }
}