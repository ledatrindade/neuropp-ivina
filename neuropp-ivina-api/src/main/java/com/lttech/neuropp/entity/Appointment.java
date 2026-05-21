package com.lttech.neuropp.entity;

import java.time.LocalDateTime;
import java.util.UUID;

import com.lttech.neuropp.enums.AppointmentStatus;

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
import jakarta.persistence.OneToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/*
 * Representa um agendamento confirmado ou em andamento.
 */
@Entity
@Table(name = "appointments")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Appointment {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    /*
     * Responsável que realizou o agendamento.
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "responsible_id", nullable = false)
    private User responsible;

    /*
     * Criança vinculada ao atendimento.
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "child_id", nullable = false)
    private Child child;

    /*
     * Horário escolhido.
     */
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "slot_id", nullable = false, unique = true)
    private AvailabilitySlot slot;

    /*
     * Status do agendamento.
     */
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private AppointmentStatus status;

    /*
     * Observações iniciais do responsável.
     */
    @Column(columnDefinition = "TEXT")
    private String notes;

    /*
     * Indica se a criança/responsável compareceu.
     */
    private Boolean attended;

    /*
     * Quando true, o agendamento não aparece mais na área do responsável.
     */
    @Column(name = "hidden_for_responsible")
    private Boolean hiddenForResponsible;

    /*
     * Quando true, o agendamento não aparece mais no histórico administrativo.
     *
     * Importante:
     * Não usamos isso para apagar do banco imediatamente. É uma ocultação
     * lógica para manter o sistema mais seguro.
     */
    @Column(name = "hidden_for_admin")
    private Boolean hiddenForAdmin;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    public void prePersist() {
        this.createdAt = LocalDateTime.now();

        if (this.status == null) {
            this.status = AppointmentStatus.CONFIRMED;
        }

        if (this.attended == null) {
            this.attended = false;
        }

        if (this.hiddenForResponsible == null) {
            this.hiddenForResponsible = false;
        }

        if (this.hiddenForAdmin == null) {
            this.hiddenForAdmin = false;
        }
    }

    @PreUpdate
    public void preUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}