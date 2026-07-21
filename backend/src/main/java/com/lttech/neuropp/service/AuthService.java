package com.lttech.neuropp.service;

import com.lttech.neuropp.dto.LoginRequest;
import com.lttech.neuropp.dto.LoginResponse;
import com.lttech.neuropp.entity.User;
import com.lttech.neuropp.repository.UserRepository;
import com.lttech.neuropp.security.JwtService;
import com.lttech.neuropp.util.InputNormalizer;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {

    private static final String INVALID_CREDENTIALS = "E-mail ou senha inválidos.";

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final String dummyPasswordHash;

    public AuthService(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            JwtService jwtService
    ) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.dummyPasswordHash = passwordEncoder.encode("dummy-password-used-only-for-timing");
    }

    @Transactional(readOnly = true)
    public LoginResponse login(LoginRequest request) {
        String email = InputNormalizer.email(request.email());

        User user = userRepository.findByEmailIgnoreCase(email).orElse(null);
        String hashToCheck = user == null ? dummyPasswordHash : user.getPasswordHash();
        boolean passwordMatches = passwordEncoder.matches(request.password(), hashToCheck);

        if (user == null || !passwordMatches || !Boolean.TRUE.equals(user.getActive())) {
            throw new BadCredentialsException(INVALID_CREDENTIALS);
        }

        JwtService.GeneratedToken generatedToken = jwtService.generate(user);

        return new LoginResponse(
                generatedToken.value(),
                "Bearer",
                generatedToken.expiresAt(),
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getRole()
        );
    }
}
