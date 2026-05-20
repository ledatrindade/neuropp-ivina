package com.lttech.neuropp.controller;

import java.time.LocalDateTime;
import java.util.Map;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

/*
 * Controller é como a recepção da nossa API.
 * Ele recebe uma requisição e devolve uma resposta.
 */
@RestController
public class HealthController {

    /*
     * Essa rota serve apenas para testar se a API está funcionando.
     *
     * Quando acessarmos:
     * http://localhost:8080/api/health
     *
     * A API deve responder com status e horário atual.
     */
    @GetMapping("/api/health")
    public Map<String, Object> health() {
        return Map.of(
                "status", "API NeuroPP funcionando",
                "project", "Site Ivina Peixoto - LT Tech",
                "timestamp", LocalDateTime.now()
        );
    }
}