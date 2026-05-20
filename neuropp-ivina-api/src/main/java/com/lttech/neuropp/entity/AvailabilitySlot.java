package com.lttech.neuropp.entity;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.UUID;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
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
 * Representa um horário disponível na agenda.
 *
 * Exemplo:
 * Data: 25/05/2026
 * Início: 09:00
 * Fim: 12:00
 */
@Entity
@Table(name = "availability_slots")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AvailabilitySlot {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    /*
     * Data do atendimento.
     */
    @Column(nullable = false)
    private LocalDate date;

    /*
     * Hora inicial.
     */
    @Column(name = "start_time", nullable = false)
    private LocalTime startTime;

    /*
     * Hora final.
     */
    @Column(name = "end_time", nullable = false)
    private LocalTime endTime;

    /*
     * Define se o horário está disponível para agendamento.
     */
    @Column(name = "is_available", nullable = false)
    private Boolean isAvailable;

    /*
     * Define se a admin bloqueou manualmente esse horário.
     */
    @Column(name = "is_blocked", nullable = false)
    private Boolean isBlocked;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    public void prePersist() {
        this.createdAt = LocalDateTime.now();

        if (this.isAvailable == null) {
            this.isAvailable = true;
        }

        if (this.isBlocked == null) {
            this.isBlocked = false;
        }
    }

    @PreUpdate
    public void preUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}