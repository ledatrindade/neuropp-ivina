package com.lttech.neuropp.service;

import com.lttech.neuropp.dto.CreateResponsibleRequest;
import com.lttech.neuropp.dto.ResponsibleResponse;
import com.lttech.neuropp.entity.User;
import com.lttech.neuropp.enums.UserRole;
import com.lttech.neuropp.exception.BusinessConflictException;
import com.lttech.neuropp.mapper.ResponsibleMapper;
import com.lttech.neuropp.repository.UserRepository;
import com.lttech.neuropp.util.InputNormalizer;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ResponsibleService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final PasswordPolicy passwordPolicy;
    private final ResponsibleMapper responsibleMapper;

    public ResponsibleService(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            PasswordPolicy passwordPolicy,
            ResponsibleMapper responsibleMapper
    ) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.passwordPolicy = passwordPolicy;
        this.responsibleMapper = responsibleMapper;
    }

    @Transactional
    public ResponsibleResponse createResponsible(CreateResponsibleRequest request) {
        String email = InputNormalizer.email(request.email());

        if (userRepository.existsByEmailIgnoreCase(email)) {
            throw new BusinessConflictException("Já existe uma conta cadastrada com este e-mail.");
        }

        passwordPolicy.validate(request.password(), email);

        User responsible = User.builder()
                .name(InputNormalizer.requiredText(request.name()))
                .email(email)
                .phone(InputNormalizer.phone(request.phone()))
                .passwordHash(passwordEncoder.encode(request.password()))
                .role(UserRole.RESPONSIBLE)
                .active(true)
                .tokenVersion(0)
                .build();

        try {
            return responsibleMapper.toResponse(userRepository.saveAndFlush(responsible));
        } catch (DataIntegrityViolationException exception) {
            throw new BusinessConflictException("Já existe uma conta cadastrada com este e-mail.");
        }
    }
}
