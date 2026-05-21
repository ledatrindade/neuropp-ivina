package com.lttech.neuropp.service;

import com.lttech.neuropp.dto.LoginRequest;
import com.lttech.neuropp.dto.LoginResponse;
import com.lttech.neuropp.entity.User;
import com.lttech.neuropp.repository.UserRepository;
import com.lttech.neuropp.security.JwtTokenService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

/*
 * Service responsável pelo login.
 */
@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenService jwtTokenService;

    public AuthService(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            JwtTokenService jwtTokenService
    ) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtTokenService = jwtTokenService;
    }

    /*
     * Faz login:
     * 1. busca usuário pelo e-mail;
     * 2. confere a senha;
     * 3. gera token;
     * 4. devolve dados básicos.
     */
    public LoginResponse login(LoginRequest request) {

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new IllegalArgumentException("E-mail ou senha inválidos."));

        boolean passwordMatches = passwordEncoder.matches(
                request.getPassword(),
                user.getPasswordHash()
        );

        if (!passwordMatches) {
            throw new IllegalArgumentException("E-mail ou senha inválidos.");
        }

        String token = jwtTokenService.generateToken(user);

        return new LoginResponse(
                token,
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getRole()
        );
    }
}