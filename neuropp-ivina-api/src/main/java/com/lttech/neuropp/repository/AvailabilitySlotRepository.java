package com.lttech.neuropp.repository;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.lttech.neuropp.entity.AvailabilitySlot;

/*
 * Repository é a camada que conversa com o banco de dados.
 */
public interface AvailabilitySlotRepository extends JpaRepository<AvailabilitySlot, UUID> {

    /*
     * Busca horários disponíveis e não bloqueados de uma data.
     */
    List<AvailabilitySlot> findByDateAndIsAvailableTrueAndIsBlockedFalseOrderByStartTimeAsc(LocalDate date);

    /*
     * Busca todos os horários de uma data, inclusive ocupados ou bloqueados.
     */
    List<AvailabilitySlot> findByDateOrderByStartTimeAsc(LocalDate date);

    /*
     * Verifica se já existe um horário exatamente igual:
     * mesma data, mesmo início e mesmo fim.
     *
     * Isso evita que Ivina crie dois horários iguais.
     */
    boolean existsByDateAndStartTimeAndEndTime(
            LocalDate date,
            LocalTime startTime,
            LocalTime endTime
    );
}