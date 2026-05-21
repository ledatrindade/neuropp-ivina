package com.lttech.neuropp.service;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.lttech.neuropp.dto.AvailabilitySlotResponse;
import com.lttech.neuropp.dto.CreateAvailabilitySlotRequest;
import com.lttech.neuropp.dto.UpdateAvailabilitySlotRequest;
import com.lttech.neuropp.entity.AvailabilitySlot;
import com.lttech.neuropp.repository.AppointmentRepository;
import com.lttech.neuropp.repository.AvailabilitySlotRepository;

/*
 * Service é onde ficam as regras de negócio da agenda.
 */
@Service
public class AvailabilitySlotService {

    private final AvailabilitySlotRepository availabilitySlotRepository;
    private final AppointmentRepository appointmentRepository;

    public AvailabilitySlotService(
            AvailabilitySlotRepository availabilitySlotRepository,
            AppointmentRepository appointmentRepository
    ) {
        this.availabilitySlotRepository = availabilitySlotRepository;
        this.appointmentRepository = appointmentRepository;
    }

    /*
     * Cria um novo horário disponível.
     */
    public AvailabilitySlotResponse createSlot(CreateAvailabilitySlotRequest request) {

        validateTimeRange(request.getStartTime(), request.getEndTime());

        boolean alreadyExists = availabilitySlotRepository.existsByDateAndStartTimeAndEndTime(
                request.getDate(),
                request.getStartTime(),
                request.getEndTime()
        );

        if (alreadyExists) {
            throw new IllegalArgumentException("Já existe um horário cadastrado para esta data e intervalo.");
        }

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
    @Transactional(readOnly = true)
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
    @Transactional(readOnly = true)
    public List<AvailabilitySlotResponse> listAllSlotsByDate(LocalDate date) {
        return availabilitySlotRepository
                .findByDateOrderByStartTimeAsc(date)
                .stream()
                .map(AvailabilitySlotResponse::fromEntity)
                .toList();
    }

    /*
     * Edita data e horário de um slot.
     *
     * Regra:
     * se o horário já tem agendamento, não pode editar.
     */
    @Transactional
    public AvailabilitySlotResponse updateSlot(UUID slotId, UpdateAvailabilitySlotRequest request) {

        AvailabilitySlot slot = findSlotById(slotId);

        if (appointmentRepository.existsBySlotId(slot.getId())) {
            throw new IllegalArgumentException("Não é possível editar um horário que já possui agendamento.");
        }

        validateTimeRange(request.getStartTime(), request.getEndTime());

        boolean duplicated = availabilitySlotRepository.existsByDateAndStartTimeAndEndTimeAndIdNot(
                request.getDate(),
                request.getStartTime(),
                request.getEndTime(),
                slot.getId()
        );

        if (duplicated) {
            throw new IllegalArgumentException("Já existe outro horário cadastrado para esta data e intervalo.");
        }

        slot.setDate(request.getDate());
        slot.setStartTime(request.getStartTime());
        slot.setEndTime(request.getEndTime());

        AvailabilitySlot savedSlot = availabilitySlotRepository.save(slot);

        return AvailabilitySlotResponse.fromEntity(savedSlot);
    }

    /*
     * Bloqueia manualmente um horário.
     *
     * Exemplo:
     * Ivina não poderá atender naquele horário.
     */
    @Transactional
    public AvailabilitySlotResponse blockSlot(UUID slotId) {

        AvailabilitySlot slot = findSlotById(slotId);

        if (appointmentRepository.existsBySlotId(slot.getId())) {
            throw new IllegalArgumentException("Não é possível bloquear um horário que já possui agendamento.");
        }

        slot.setIsBlocked(true);
        slot.setIsAvailable(false);

        AvailabilitySlot savedSlot = availabilitySlotRepository.save(slot);

        return AvailabilitySlotResponse.fromEntity(savedSlot);
    }

    /*
     * Desbloqueia um horário bloqueado manualmente.
     */
    @Transactional
    public AvailabilitySlotResponse unblockSlot(UUID slotId) {

        AvailabilitySlot slot = findSlotById(slotId);

        if (appointmentRepository.existsBySlotId(slot.getId())) {
            throw new IllegalArgumentException("Não é possível desbloquear um horário que já possui agendamento.");
        }

        slot.setIsBlocked(false);
        slot.setIsAvailable(true);

        AvailabilitySlot savedSlot = availabilitySlotRepository.save(slot);

        return AvailabilitySlotResponse.fromEntity(savedSlot);
    }

    /*
     * Exclui um horário.
     *
     * Regra:
     * só pode excluir horário sem agendamento.
     */
    @Transactional
    public void deleteSlot(UUID slotId) {

        AvailabilitySlot slot = findSlotById(slotId);

        if (appointmentRepository.existsBySlotId(slot.getId())) {
            throw new IllegalArgumentException("Não é possível excluir um horário que já possui agendamento.");
        }

        availabilitySlotRepository.delete(slot);
    }

    /*
     * Busca um horário pelo ID.
     */
    private AvailabilitySlot findSlotById(UUID slotId) {
        return availabilitySlotRepository.findById(slotId)
                .orElseThrow(() -> new IllegalArgumentException("Horário não encontrado."));
    }

    /*
     * Valida se o horário final é depois do horário inicial.
     */
    private void validateTimeRange(java.time.LocalTime startTime, java.time.LocalTime endTime) {
        if (!endTime.isAfter(startTime)) {
            throw new IllegalArgumentException("O horário final precisa ser depois do horário inicial.");
        }
    }
}