package com.lttech.neuropp.repository;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.lttech.neuropp.entity.Appointment;

/*
 * Repository da tabela appointments.
 */
public interface AppointmentRepository extends JpaRepository<Appointment, UUID> {

    /*
     * Lista agendamentos de um responsável.
     */
    List<Appointment> findByResponsibleIdOrderByCreatedAtDesc(UUID responsibleId);

    /*
     * Verifica se já existe agendamento para um horário.
     * Isso ajuda a impedir horário duplicado.
     */
    boolean existsBySlotId(UUID slotId);
}