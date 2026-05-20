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
     * Busca os horários disponíveis de uma data.
     */
    List<AvailabilitySlot> findByDateAndIsAvailableTrueAndIsBlockedFalseOrderByStartTimeAsc(LocalDate date);

    /*
     * Busca todos os horários de uma data.
     */
    List<AvailabilitySlot> findByDateOrderByStartTimeAsc(LocalDate date);

    /*
     * Verifica se já existe um horário exatamente igual:
     * mesma data, mesmo horário inicial e mesmo horário final.
     *
     * Isso evita duplicidade na agenda.
     */
    boolean existsByDateAndStartTimeAndEndTime(
            LocalDate date,
            LocalTime startTime,
            LocalTime endTime
    );
}