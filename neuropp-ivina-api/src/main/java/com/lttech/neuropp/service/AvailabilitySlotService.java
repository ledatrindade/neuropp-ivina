package com.lttech.neuropp.service;

import java.time.LocalDate;
import java.util.List;

import org.springframework.stereotype.Service;

import com.lttech.neuropp.dto.AvailabilitySlotResponse;
import com.lttech.neuropp.dto.CreateAvailabilitySlotRequest;
import com.lttech.neuropp.entity.AvailabilitySlot;
import com.lttech.neuropp.repository.AvailabilitySlotRepository;

/*
 * Service é onde ficam as regras de negócio.
 */
@Service
public class AvailabilitySlotService {

    private final AvailabilitySlotRepository availabilitySlotRepository;

    public AvailabilitySlotService(AvailabilitySlotRepository availabilitySlotRepository) {
        this.availabilitySlotRepository = availabilitySlotRepository;
    }

    /*
     * Cria um novo horário disponível.
     */
    public AvailabilitySlotResponse createSlot(CreateAvailabilitySlotRequest request) {

        /*
         * Regra 1:
         * O horário final precisa ser depois do horário inicial.
         */
        if (!request.getEndTime().isAfter(request.getStartTime())) {
            throw new IllegalArgumentException("O horário final precisa ser depois do horário inicial.");
        }

        /*
         * Regra 2:
         * Não pode existir dois horários iguais no mesmo dia.
         */
        boolean alreadyExists = availabilitySlotRepository.existsByDateAndStartTimeAndEndTime(
                request.getDate(),
                request.getStartTime(),
                request.getEndTime()
        );

        if (alreadyExists) {
            throw new IllegalArgumentException("Já existe um horário cadastrado para esta data e intervalo.");
        }

        /*
         * Montamos a entidade que será salva no banco.
         */
        AvailabilitySlot slot = AvailabilitySlot.builder()
                .date(request.getDate())
                .startTime(request.getStartTime())
                .endTime(request.getEndTime())
                .isAvailable(true)
                .isBlocked(false)
                .build();

        AvailabilitySlot savedSlot = availabilitySlotRepository.save(slot);

        return AvailabilitySlotResponse.fromEntity(savedSlot);
    }

    /*
     * Lista horários disponíveis para o site público.
     */
    public List<AvailabilitySlotResponse> listAvailableSlotsByDate(LocalDate date) {
        return availabilitySlotRepository
                .findByDateAndIsAvailableTrueAndIsBlockedFalseOrderByStartTimeAsc(date)
                .stream()
                .map(AvailabilitySlotResponse::fromEntity)
                .toList();
    }

    /*
     * Lista todos os horários para o painel administrativo.
     */
    public List<AvailabilitySlotResponse> listAllSlotsByDate(LocalDate date) {
        return availabilitySlotRepository
                .findByDateOrderByStartTimeAsc(date)
                .stream()
                .map(AvailabilitySlotResponse::fromEntity)
                .toList();
    }
}