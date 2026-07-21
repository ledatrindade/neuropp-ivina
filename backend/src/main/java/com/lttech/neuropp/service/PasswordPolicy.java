package com.lttech.neuropp.service;

import com.lttech.neuropp.exception.BusinessRuleException;
import org.springframework.stereotype.Component;

import java.nio.charset.StandardCharsets;
import java.util.Locale;
import java.util.Set;

@Component
public class PasswordPolicy {

    private static final Set<String> COMMON_PASSWORDS = Set.of(
            "123456789012",
            "password1234",
            "senha123456",
            "qwerty123456",
            "administrador",
            "admin1234567"
    );

    public void validate(String password, String email) {
        if (password.getBytes(StandardCharsets.UTF_8).length > 72) {
            throw new BusinessRuleException(
                    "A senha deve possuir no máximo 72 bytes para ser armazenada com BCrypt."
            );
        }

        String normalized = password.toLowerCase(Locale.ROOT);

        if (COMMON_PASSWORDS.contains(normalized)) {
            throw new BusinessRuleException("Escolha uma senha menos previsível.");
        }

        if (normalized.chars().allMatch(Character::isDigit)) {
            throw new BusinessRuleException("A senha não pode conter apenas números.");
        }

        String emailLocalPart = email.split("@", 2)[0].toLowerCase(Locale.ROOT);
        if (emailLocalPart.length() >= 4 && normalized.contains(emailLocalPart)) {
            throw new BusinessRuleException("A senha não deve conter a parte principal do e-mail.");
        }
    }
}
