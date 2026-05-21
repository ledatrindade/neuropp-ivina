package com.lttech.neuropp.repository;

import java.util.List;
import java.util.Optional;
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
     * Lista todos os agendamentos para o admin.
     */
    List<Appointment> findAllByOrderByCreatedAtDesc();

    /*
     * Verifica se já existe agendamento para um horário.
     */
    boolean existsBySlotId(UUID slotId);

    /*
     * Busca agendamento vinculado a um horário.
     *
     * Usado para permitir excluir um horário quando o agendamento vinculado
     * já está cancelado.
     */
    Optional<Appointment> findBySlotId(UUID slotId);
}