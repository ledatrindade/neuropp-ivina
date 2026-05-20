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
 *
 * Controller recebe a requisição.
 * Service decide o que fazer.
 * Repository salva ou busca no banco.
 */
@Service
public class AvailabilitySlotService {

    private final AvailabilitySlotRepository availabilitySlotRepository;

    /*
     * Injeção de dependência.
     *
     * O Spring entrega automaticamente o repository para o service.
     */
    public AvailabilitySlotService(AvailabilitySlotRepository availabilitySlotRepository) {
        this.availabilitySlotRepository = availabilitySlotRepository;
    }

    /*
     * Cria um novo horário disponível.
     */
    public AvailabilitySlotResponse createSlot(CreateAvailabilitySlotRequest request) {

        /*
         * Regra de negócio:
         * O horário final precisa ser depois do horário inicial.
         *
         * Exemplo válido:
         * 09:00 até 12:00
         *
         * Exemplo inválido:
         * 12:00 até 09:00
         */
        if (!request.getEndTime().isAfter(request.getStartTime())) {
            throw new IllegalArgumentException("O horário final precisa ser depois do horário inicial.");
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

        /*
         * Salvamos no banco.
         */
        AvailabilitySlot savedSlot = availabilitySlotRepository.save(slot);

        /*
         * Retornamos a resposta formatada para o front-end.
         */
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