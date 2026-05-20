package com.lttech.neuropp.exception;

import java.util.LinkedHashMap;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import com.lttech.neuropp.dto.ApiErrorResponse;

import jakarta.servlet.http.HttpServletRequest;

/*
 * Classe global de tratamento de erros.
 *
 * Ela intercepta erros da aplicação e transforma em respostas JSON organizadas.
 *
 * Exemplo:
 * Se o service lançar:
 * throw new IllegalArgumentException("Horário indisponível");
 *
 * O usuário recebe:
 * {
 *   "status": 400,
 *   "message": "Horário indisponível"
 * }
 */
@RestControllerAdvice
public class GlobalExceptionHandler {

    /*
     * Trata erros de regra de negócio.
     *
     * Exemplo:
     * - responsável não encontrado;
     * - criança não pertence ao responsável;
     * - horário já ocupado;
     * - horário final antes do inicial.
     */
    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<ApiErrorResponse> handleIllegalArgumentException(
            IllegalArgumentException exception,
            HttpServletRequest request
    ) {
        ApiErrorResponse response = ApiErrorResponse.of(
                HttpStatus.BAD_REQUEST.value(),
                "Bad Request",
                exception.getMessage(),
                request.getRequestURI()
        );

        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
    }

    /*
     * Trata erros de validação dos DTOs.
     *
     * Exemplo:
     * Se esquecermos de enviar "date" no JSON,
     * a API devolve qual campo está errado.
     */
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiErrorResponse> handleValidationException(
            MethodArgumentNotValidException exception,
            HttpServletRequest request
    ) {
        Map<String, String> fieldErrors = new LinkedHashMap<>();

        exception.getBindingResult().getFieldErrors().forEach(error -> {
            fieldErrors.put(error.getField(), error.getDefaultMessage());
        });

        ApiErrorResponse response = ApiErrorResponse.withFieldErrors(
                HttpStatus.BAD_REQUEST.value(),
                "Validation Error",
                "Existem campos inválidos na requisição.",
                request.getRequestURI(),
                fieldErrors
        );

        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
    }

    /*
     * Trata erros inesperados.
     *
     * Esse é o nosso "plano B".
     * Se algo que não previmos acontecer, a API ainda responde de forma limpa.
     */
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiErrorResponse> handleGenericException(
            Exception exception,
            HttpServletRequest request
    ) {
        ApiErrorResponse response = ApiErrorResponse.of(
                HttpStatus.INTERNAL_SERVER_ERROR.value(),
                "Internal Server Error",
                "Ocorreu um erro inesperado no servidor.",
                request.getRequestURI()
        );

        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
    }
}