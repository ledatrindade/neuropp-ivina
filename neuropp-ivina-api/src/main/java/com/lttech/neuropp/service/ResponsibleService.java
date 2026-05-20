package com.lttech.neuropp.service;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.lttech.neuropp.dto.CreateResponsibleRequest;
import com.lttech.neuropp.dto.ResponsibleResponse;
import com.lttech.neuropp.entity.User;
import com.lttech.neuropp.enums.UserRole;
import com.lttech.neuropp.repository.UserRepository;

/*
 * Service responsável pelas regras de cadastro do responsável.
 */
@Service
public class ResponsibleService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public ResponsibleService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public ResponsibleResponse createResponsible(CreateResponsibleRequest request) {

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("Já existe um responsável cadastrado com este e-mail.");
        }

        User responsible = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .phone(request.getPhone())
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .role(UserRole.RESPONSIBLE)
                .build();

        User savedResponsible = userRepository.save(responsible);

        return ResponsibleResponse.fromEntity(savedResponsible);
    }
}