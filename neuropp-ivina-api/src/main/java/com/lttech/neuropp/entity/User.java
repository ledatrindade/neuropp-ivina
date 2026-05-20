package com.lttech.neuropp.entity;

import java.time.LocalDateTime;
import java.util.UUID;

import com.lttech.neuropp.enums.UserRole;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/*
 * Entity representa uma tabela no banco de dados.
 *
 * Essa classe User vai virar uma tabela chamada app_users.
 * Usamos app_users em vez de users para evitar conflito com nomes reservados.
 */
@Entity
@Table(name = "app_users")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {

    /*
     * ID único do usuário.
     * UUID é bom porque evita IDs previsíveis como 1, 2, 3...
     */
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    /*
     * Nome completo do responsável ou da administradora.
     */
    @Column(nullable = false, length = 150)
    private String name;

    /*
     * E-mail usado para login.
     * unique = true impede dois usuários com o mesmo e-mail.
     */
    @Column(nullable = false, unique = true, length = 150)
    private String email;

    /*
     * WhatsApp do usuário.
     * Será usado para contato e notificações.
     */
    @Column(nullable = false, length = 20)
    private String phone;

    /*
     * Senha criptografada.
     * Nunca salvamos senha pura no banco.
     */
    @Column(name = "password_hash", nullable = false)
    private String passwordHash;

    /*
     * Tipo do usuário:
     * ADMIN ou RESPONSIBLE.
     */
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private UserRole role;

    /*
     * Data de criação do registro.
     */
    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    /*
     * Data da última atualização do registro.
     */
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    /*
     * Antes de salvar pela primeira vez, o Java executa esse método.
     */
    @PrePersist
    public void prePersist() {
        this.createdAt = LocalDateTime.now();

        if (this.role == null) {
            this.role = UserRole.RESPONSIBLE;
        }
    }

    /*
     * Antes de atualizar um registro, o Java executa esse método.
     */
    @PreUpdate
    public void preUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}