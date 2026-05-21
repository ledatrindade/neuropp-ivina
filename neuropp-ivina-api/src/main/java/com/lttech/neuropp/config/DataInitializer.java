package com.lttech.neuropp.config;

import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import com.lttech.neuropp.entity.User;
import com.lttech.neuropp.enums.UserRole;
import com.lttech.neuropp.repository.UserRepository;

/*
 * Classe que roda quando a aplicação inicia.
 *
 * Vamos usar para criar uma admin inicial da Ivina em ambiente de desenvolvimento.
 */
@Component
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder
    ) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {

        String adminEmail = "ivina.admin@neuropp.com";

        if (userRepository.existsByEmail(adminEmail)) {
            return;
        }

        User admin = User.builder()
                .name("Ivina Peixoto")
                .email(adminEmail)
                .phone("81999990000")
                .passwordHash(passwordEncoder.encode("123456"))
                .role(UserRole.ADMIN)
                .build();

        userRepository.save(admin);

        System.out.println(">>> Admin inicial criada: " + adminEmail);
    }
}