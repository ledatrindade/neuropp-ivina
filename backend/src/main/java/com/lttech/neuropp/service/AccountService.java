package com.lttech.neuropp.service;

import com.lttech.neuropp.dto.ChangePasswordRequest;
import com.lttech.neuropp.entity.User;
import com.lttech.neuropp.exception.BusinessRuleException;
import com.lttech.neuropp.exception.ResourceNotFoundException;
import com.lttech.neuropp.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
public class AccountService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final PasswordPolicy passwordPolicy;

    public AccountService(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            PasswordPolicy passwordPolicy
    ) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.passwordPolicy = passwordPolicy;
    }

    @Transactional
    public void changePassword(UUID userId, ChangePasswordRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Usuário não encontrado."));

        if (!Boolean.TRUE.equals(user.getActive())) {
            throw new BusinessRuleException("A conta está inativa.");
        }

        if (!passwordEncoder.matches(request.currentPassword(), user.getPasswordHash())) {
            throw new BusinessRuleException("A senha atual está incorreta.");
        }

        if (passwordEncoder.matches(request.newPassword(), user.getPasswordHash())) {
            throw new BusinessRuleException("A nova senha precisa ser diferente da senha atual.");
        }

        passwordPolicy.validate(request.newPassword(), user.getEmail());

        user.setPasswordHash(passwordEncoder.encode(request.newPassword()));
        user.setTokenVersion(user.getTokenVersion() + 1);
        userRepository.save(user);
    }
}
