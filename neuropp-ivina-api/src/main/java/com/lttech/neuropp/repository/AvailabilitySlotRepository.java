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
     * Essa rota será usada pelo site público.
     */
    List<AvailabilitySlot> findByDateAndIsAvailableTrueAndIsBlockedFalseOrderByStartTimeAsc(LocalDate date);

    /*
     * Busca todos os horários de uma data.
     * Essa rota será usada pelo painel administrativo.
     */
    List<AvailabilitySlot> findByDateOrderByStartTimeAsc(LocalDate date);

    /*
     * Verifica se já existe um horário exatamente igual.
     */
    boolean existsByDateAndStartTimeAndEndTime(
            LocalDate date,
            LocalTime startTime,
            LocalTime endTime
    );

    /*
     * Verifica duplicidade ignorando o próprio horário.
     *
     * Isso é importante na edição.
     * Exemplo: se eu editar um horário mantendo a mesma data e hora,
     * ele não pode acusar duplicidade contra ele mesmo.
     */
    boolean existsByDateAndStartTimeAndEndTimeAndIdNot(
            LocalDate date,
            LocalTime startTime,
            LocalTime endTime,
            UUID id
    );
}