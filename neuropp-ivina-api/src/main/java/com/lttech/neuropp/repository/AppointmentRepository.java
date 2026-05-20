package com.lttech.neuropp.repository;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.lttech.neuropp.entity.Appointment;

/*
 * Repository da tabela appointments.
 *
 * Ele conversa diretamente com o banco de dados
 * para buscar, salvar e consultar agendamentos.
 */
public interface AppointmentRepository extends JpaRepository<Appointment, UUID> {

    /*
     * Lista agendamentos de um responsável,
     * mostrando primeiro os mais recentes.
     */
    List<Appointment> findByResponsibleIdOrderByCreatedAtDesc(UUID responsibleId);

    /*
     * Lista todos os agendamentos para o admin,
     * mostrando primeiro os mais recentes.
     */
    List<Appointment> findAllByOrderByCreatedAtDesc();

    /*
     * Verifica se já existe agendamento para um horário.
     *
     * Isso impede que duas pessoas agendem o mesmo slot.
     */
    boolean existsBySlotId(UUID slotId);
}