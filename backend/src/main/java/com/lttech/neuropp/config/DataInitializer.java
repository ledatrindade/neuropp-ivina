package com.lttech.neuropp.config;

import com.lttech.neuropp.entity.User;
import com.lttech.neuropp.enums.UserRole;
import com.lttech.neuropp.repository.UserRepository;
import com.lttech.neuropp.service.PasswordPolicy;
import com.lttech.neuropp.util.InputNormalizer;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@ConditionalOnProperty(
        prefix = "app.bootstrap-admin",
        name = "enabled",
        havingValue = "true"
)
public class DataInitializer implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DataInitializer.class);

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final BootstrapAdminProperties properties;
    private final PasswordPolicy passwordPolicy;

    public DataInitializer(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            BootstrapAdminProperties properties,
            PasswordPolicy passwordPolicy
    ) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.properties = properties;
        this.passwordPolicy = passwordPolicy;
    }

    @Override
    public void run(String... args) {
        validateConfiguration();

        String email = InputNormalizer.email(properties.email());

        if (userRepository.existsByEmailIgnoreCase(email)) {
            log.info("Admin inicial não foi criado porque o e-mail já existe.");
            return;
        }

        passwordPolicy.validate(properties.password(), email);

        User admin = User.builder()
                .name(InputNormalizer.requiredText(properties.name()))
                .email(email)
                .phone(InputNormalizer.phone(properties.phone()))
                .passwordHash(passwordEncoder.encode(properties.password()))
                .role(UserRole.ADMIN)
                .active(true)
                .tokenVersion(0)
                .build();

        userRepository.save(admin);
        log.info("Admin inicial criado com sucesso.");
    }

    private void validateConfiguration() {
        if (properties.name() == null || properties.name().isBlank()
                || properties.email() == null || properties.email().isBlank()
                || properties.phone() == null || properties.phone().isBlank()
                || properties.password() == null || properties.password().isBlank()) {
            throw new IllegalStateException(
                    "O bootstrap do admin está habilitado, mas as variáveis do admin não foram preenchidas."
            );
        }

        if (properties.name().strip().length() < 3 || properties.name().strip().length() > 150) {
            throw new IllegalStateException("O nome do admin inicial deve ter entre 3 e 150 caracteres.");
        }

        String normalizedPhone = InputNormalizer.phone(properties.phone());
        if (!normalizedPhone.matches("^\\+?[1-9]\\d{9,14}$")) {
            throw new IllegalStateException("O telefone do admin inicial é inválido.");
        }

        String normalizedEmail = InputNormalizer.email(properties.email());
        if (!normalizedEmail.matches("^[^@\\s]+@[^@\\s]+\\.[^@\\s]+$")) {
            throw new IllegalStateException("O e-mail do admin inicial é inválido.");
        }

        if (properties.password().length() < 12 || properties.password().length() > 72) {
            throw new IllegalStateException(
                    "A senha do admin inicial deve ter entre 12 e 72 caracteres."
            );
        }
    }
}
