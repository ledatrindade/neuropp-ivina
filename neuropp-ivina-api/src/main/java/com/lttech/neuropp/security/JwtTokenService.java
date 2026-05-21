package com.lttech.neuropp.security;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.lttech.neuropp.entity.User;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.time.Instant;
import java.util.Base64;
import java.util.LinkedHashMap;
import java.util.Map;

/*
 * Serviço responsável por gerar e validar tokens JWT.
 *
 * JWT é um token com três partes:
 *
 * header.payload.signature
 *
 * Exemplo:
 * xxxxx.yyyyy.zzzzz
 *
 * Header: diz o tipo e algoritmo.
 * Payload: guarda informações como userId, email, role e expiração.
 * Signature: assinatura que impede alteração do token.
 */
@Service
public class JwtTokenService {

    private final String secret;
    private final long expirationHours;
    private final ObjectMapper objectMapper = new ObjectMapper();

    public JwtTokenService(
            @Value("${app.jwt.secret}") String secret,
            @Value("${app.jwt.expiration-hours}") long expirationHours
    ) {
        this.secret = secret;
        this.expirationHours = expirationHours;
    }

    /*
     * Gera token para um usuário autenticado.
     */
    public String generateToken(User user) {
        Map<String, Object> header = new LinkedHashMap<>();
        header.put("alg", "HS256");
        header.put("typ", "JWT");

        long expiration = Instant.now()
                .plusSeconds(expirationHours * 60 * 60)
                .getEpochSecond();

        Map<String, Object> payload = new LinkedHashMap<>();
        payload.put("sub", user.getEmail());
        payload.put("userId", user.getId().toString());
        payload.put("name", user.getName());
        payload.put("role", user.getRole().name());
        payload.put("exp", expiration);

        String encodedHeader = encodeBase64Url(toJson(header));
        String encodedPayload = encodeBase64Url(toJson(payload));

        String data = encodedHeader + "." + encodedPayload;
        String signature = sign(data);

        return data + "." + signature;
    }

    /*
     * Valida se o token:
     * - tem três partes;
     * - possui assinatura correta;
     * - não está expirado.
     */
    public boolean isTokenValid(String token) {
        try {
            String[] parts = token.split("\\.");

            if (parts.length != 3) {
                return false;
            }

            String data = parts[0] + "." + parts[1];
            String expectedSignature = sign(data);
            String receivedSignature = parts[2];

            boolean signatureMatches = MessageDigest.isEqual(
                    expectedSignature.getBytes(StandardCharsets.UTF_8),
                    receivedSignature.getBytes(StandardCharsets.UTF_8)
            );

            if (!signatureMatches) {
                return false;
            }

            Map<String, Object> payload = parsePayload(token);
            Number exp = (Number) payload.get("exp");

            return Instant.now().getEpochSecond() < exp.longValue();

        } catch (Exception exception) {
            return false;
        }
    }

    /*
     * Extrai o userId do token.
     */
    public String getUserIdFromToken(String token) {
        Map<String, Object> payload = parsePayload(token);
        return (String) payload.get("userId");
    }

    /*
     * Extrai a role do token.
     */
    public String getRoleFromToken(String token) {
        Map<String, Object> payload = parsePayload(token);
        return (String) payload.get("role");
    }

    /*
     * Extrai o e-mail do token.
     */
    public String getEmailFromToken(String token) {
        Map<String, Object> payload = parsePayload(token);
        return (String) payload.get("sub");
    }

    private Map<String, Object> parsePayload(String token) {
        try {
            String[] parts = token.split("\\.");
            String payloadJson = new String(
                    Base64.getUrlDecoder().decode(parts[1]),
                    StandardCharsets.UTF_8
            );

            return objectMapper.readValue(payloadJson, Map.class);

        } catch (Exception exception) {
            throw new IllegalArgumentException("Token inválido.");
        }
    }

    private String toJson(Object value) {
        try {
            return objectMapper.writeValueAsString(value);
        } catch (Exception exception) {
            throw new IllegalArgumentException("Erro ao gerar token.");
        }
    }

    private String encodeBase64Url(String value) {
        return Base64.getUrlEncoder()
                .withoutPadding()
                .encodeToString(value.getBytes(StandardCharsets.UTF_8));
    }

    private String sign(String data) {
        try {
            Mac hmac = Mac.getInstance("HmacSHA256");

            SecretKeySpec key = new SecretKeySpec(
                    secret.getBytes(StandardCharsets.UTF_8),
                    "HmacSHA256"
            );

            hmac.init(key);

            byte[] signatureBytes = hmac.doFinal(data.getBytes(StandardCharsets.UTF_8));

            return Base64.getUrlEncoder()
                    .withoutPadding()
                    .encodeToString(signatureBytes);

        } catch (Exception exception) {
            throw new IllegalArgumentException("Erro ao assinar token.");
        }
    }
}