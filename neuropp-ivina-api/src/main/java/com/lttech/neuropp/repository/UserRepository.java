package com.lttech.neuropp.repository;

import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.lttech.neuropp.entity.User;

/*
 * Repository da tabela app_users.
 */
public interface UserRepository extends JpaRepository<User, UUID> {

    /*
     * Busca usuário por e-mail.
     * Será usado para evitar cadastro duplicado e depois para login.
     */
    Optional<User> findByEmail(String email);

    /*
     * Verifica se já existe usuário com aquele e-mail.
     */
    boolean existsByEmail(String email);
}