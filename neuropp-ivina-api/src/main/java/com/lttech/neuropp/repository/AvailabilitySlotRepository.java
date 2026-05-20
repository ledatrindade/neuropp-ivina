package com.lttech.neuropp.repository;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.lttech.neuropp.entity.AvailabilitySlot;

/*
 * Repository é a camada que conversa com o banco de dados.
 *
 * Essa interface representa a tabela availability_slots.
 * O JpaRepository já entrega métodos prontos como:
 * - save()
 * - findById()
 * - findAll()
 * - delete()
 */
public interface AvailabilitySlotRepository extends JpaRepository<AvailabilitySlot, UUID> {

    /*
     * Busca os horários disponíveis de uma data.
     *
     * O método filtra:
     * - data escolhida;
     * - horários disponíveis;
     * - horários não bloqueados;
     *
     * E ordena pelo horário inicial.
     */
    List<AvailabilitySlot> findByDateAndIsAvailableTrueAndIsBlockedFalseOrderByStartTimeAsc(LocalDate date);

    /*
     * Busca todos os horários de uma data.
     *
     * Essa busca será usada no painel administrativo,
     * porque Ivina precisa ver horários disponíveis, ocupados ou bloqueados.
     */
    List<AvailabilitySlot> findByDateOrderByStartTimeAsc(LocalDate date);
}