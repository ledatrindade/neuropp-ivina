package com.lttech.neuropp.service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.lttech.neuropp.dto.AvailabilitySlotResponse;
import com.lttech.neuropp.dto.CreateAvailabilitySlotRequest;
import com.lttech.neuropp.dto.UpdateAvailabilitySlotRequest;
import com.lttech.neuropp.entity.Appointment;
import com.lttech.neuropp.entity.AvailabilitySlot;
import com.lttech.neuropp.enums.AppointmentStatus;
import com.lttech.neuropp.repository.AppointmentRepository;
import com.lttech.neuropp.repository.AttendanceDocumentRepository;
import com.lttech.neuropp.repository.AvailabilitySlotRepository;

/*
 * Service é onde ficam as regras de negócio da agenda.
 */
@Service
public class AvailabilitySlotService {

    private final AvailabilitySlotRepository availabilitySlotRepository;
    private final AppointmentRepository appointmentRepository;
    private final AttendanceDocumentRepository attendanceDocumentRepository;

    public AvailabilitySlotService(
            AvailabilitySlotRepository availabilitySlotRepository,
            AppointmentRepository appointmentRepository,
            AttendanceDocumentRepository attendanceDocumentRepository
    ) {
        this.availabilitySlotRepository = availabilitySlotRepository;
        this.appointmentRepository = appointmentRepository;
        this.attendanceDocumentRepository = attendanceDocumentRepository;
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
     * se o horário já tem agendamento ativo, não pode editar.
     */
    @Transactional
    public AvailabilitySlotResponse updateSlot(UUID slotId, UpdateAvailabilitySlotRequest request) {

        AvailabilitySlot slot = findSlotById(slotId);

        Optional<Appointment> appointmentOptional = appointmentRepository.findBySlotId(slot.getId());

        if (appointmentOptional.isPresent()
                && appointmentOptional.get().getStatus() != AppointmentStatus.CANCELLED) {
            throw new IllegalArgumentException("Não é possível editar um horário que já possui agendamento ativo.");
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
     */
    @Transactional
    public AvailabilitySlotResponse blockSlot(UUID slotId) {

        AvailabilitySlot slot = findSlotById(slotId);

        Optional<Appointment> appointmentOptional = appointmentRepository.findBySlotId(slot.getId());

        if (appointmentOptional.isPresent()
                && appointmentOptional.get().getStatus() != AppointmentStatus.CANCELLED) {
            throw new IllegalArgumentException("Não é possível bloquear um horário que já possui agendamento ativo.");
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

        Optional<Appointment> appointmentOptional = appointmentRepository.findBySlotId(slot.getId());

        if (appointmentOptional.isPresent()
                && appointmentOptional.get().getStatus() != AppointmentStatus.CANCELLED) {
            throw new IllegalArgumentException("Não é possível desbloquear um horário que já possui agendamento ativo.");
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
     * - se não tiver agendamento, exclui normalmente;
     * - se tiver agendamento cancelado, remove o agendamento cancelado e depois exclui o horário;
     * - se tiver agendamento ativo/concluído/faltou/compareceu, não exclui.
     */
    @Transactional
    public void deleteSlot(UUID slotId) {

        AvailabilitySlot slot = findSlotById(slotId);

        Optional<Appointment> appointmentOptional = appointmentRepository.findBySlotId(slot.getId());

        if (appointmentOptional.isPresent()) {
            Appointment appointment = appointmentOptional.get();

            if (appointment.getStatus() != AppointmentStatus.CANCELLED) {
                throw new IllegalArgumentException(
                        "Não é possível excluir este horário porque ele possui um agendamento ativo ou histórico não cancelado."
                );
            }

            /*
             * Se o agendamento está cancelado, podemos remover o vínculo.
             * Primeiro removemos documentos relacionados para evitar erro de chave estrangeira.
             */
            attendanceDocumentRepository.deleteByAppointmentId(appointment.getId());
            appointmentRepository.delete(appointment);
        }

        availabilitySlotRepository.delete(slot);
    }

    private AvailabilitySlot findSlotById(UUID slotId) {
        return availabilitySlotRepository.findById(slotId)
                .orElseThrow(() -> new IllegalArgumentException("Horário não encontrado."));
    }

    private void validateTimeRange(java.time.LocalTime startTime, java.time.LocalTime endTime) {
        if (!endTime.isAfter(startTime)) {
            throw new IllegalArgumentException("O horário final precisa ser depois do horário inicial.");
        }
    }
}