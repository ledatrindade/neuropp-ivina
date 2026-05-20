package com.lttech.neuropp.entity;

import java.time.LocalDateTime;
import java.util.UUID;

import com.lttech.neuropp.enums.DocumentType;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/*
 * Documento privado criado ou anexado por Ivina.
 *
 * Exemplo:
 * - resumo da avaliação;
 * - registro da sessão;
 * - devolutiva;
 * - orientação familiar.
 */
@Entity
@Table(name = "attendance_documents")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AttendanceDocument {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    /*
     * Documento ligado a um agendamento específico.
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "appointment_id", nullable = false)
    private Appointment appointment;

    /*
     * Criança relacionada ao documento.
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "child_id", nullable = false)
    private Child child;

    /*
     * Responsável que poderá acessar esse documento.
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "responsible_id", nullable = false)
    private User responsible;

    /*
     * Título do documento.
     */
    @Column(nullable = false, length = 180)
    private String title;

    /*
     * Tipo do documento.
     */
    @Enumerated(EnumType.STRING)
    @Column(name = "document_type", nullable = false, length = 40)
    private DocumentType documentType;

    /*
     * Conteúdo do documento, caso seja escrito dentro do sistema.
     */
    @Column(columnDefinition = "TEXT")
    private String content;

    /*
     * Link do arquivo, caso futuramente seja feito upload.
     */
    @Column(name = "file_url")
    private String fileUrl;

    /*
     * Define se o documento já foi liberado para o responsável.
     */
    @Column(name = "is_released", nullable = false)
    private Boolean isReleased;

    /*
     * Data em que Ivina liberou o documento.
     */
    @Column(name = "released_at")
    private LocalDateTime releasedAt;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    public void prePersist() {
        this.createdAt = LocalDateTime.now();

        if (this.isReleased == null) {
            this.isReleased = false;
        }
    }

    @PreUpdate
    public void preUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}