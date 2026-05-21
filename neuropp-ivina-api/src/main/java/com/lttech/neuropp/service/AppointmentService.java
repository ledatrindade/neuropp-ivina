package com.lttech.neuropp.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.lttech.neuropp.dto.AppointmentResponse;
import com.lttech.neuropp.dto.CreateAppointmentRequest;
import com.lttech.neuropp.dto.CreateMyAppointmentRequest;
import com.lttech.neuropp.dto.RescheduleAppointmentRequest;
import com.lttech.neuropp.dto.UpdateAppointmentStatusRequest;
import com.lttech.neuropp.entity.Appointment;
import com.lttech.neuropp.entity.AvailabilitySlot;
import com.lttech.neuropp.entity.Child;
import com.lttech.neuropp.entity.User;
import com.lttech.neuropp.enums.AppointmentStatus;
import com.lttech.neuropp.repository.AppointmentRepository;
import com.lttech.neuropp.repository.AvailabilitySlotRepository;
import com.lttech.neuropp.repository.ChildRepository;
import com.lttech.neuropp.repository.UserRepository;

/*
 * Service responsável pelas regras de agendamento.
 */
@Service
public class AppointmentService {

    private final AppointmentRepository appointmentRepository;
    private final UserRepository userRepository;
    private final ChildRepository childRepository;
    private final AvailabilitySlotRepository availabilitySlotRepository;

    public AppointmentService(
            AppointmentRepository appointmentRepository,
            UserRepository userRepository,
            ChildRepository childRepository,
            AvailabilitySlotRepository availabilitySlotRepository
    ) {
        this.appointmentRepository = appointmentRepository;
        this.userRepository = userRepository;
        this.childRepository = childRepository;
        this.availabilitySlotRepository = availabilitySlotRepository;
    }

    @Transactional
    public AppointmentResponse createAppointment(CreateAppointmentRequest request) {
        User responsible = userRepository.findById(request.getResponsibleId())
                .orElseThrow(() -> new IllegalArgumentException("Responsável não encontrado."));

        Child child = childRepository.findById(request.getChildId())
                .orElseThrow(() -> new IllegalArgumentException("Criança não encontrada."));

        AvailabilitySlot slot = availabilitySlotRepository.findById(request.getSlotId())
                .orElseThrow(() -> new IllegalArgumentException("Horário não encontrado."));

        validateChildBelongsToResponsible(child, responsible.getId());
        validateSlotIsAvailable(slot);

        if (appointmentRepository.existsBySlotId(slot.getId())) {
            throw new IllegalArgumentException("Este horário já possui um agendamento.");
        }

        Appointment appointment = Appointment.builder()
                .responsible(responsible)
                .child(child)
                .slot(slot)
                .status(AppointmentStatus.CONFIRMED)
                .notes(request.getNotes())
                .attended(false)
                .hiddenForResponsible(false)
                .hiddenForAdmin(false)
                .build();

        Appointment savedAppointment = appointmentRepository.save(appointment);

        slot.setIsAvailable(false);
        availabilitySlotRepository.save(slot);

        return AppointmentResponse.fromEntity(savedAppointment);
    }

    @Transactional
    public AppointmentResponse createAppointmentForResponsible(
            UUID responsibleId,
            CreateMyAppointmentRequest request
    ) {
        User responsible = userRepository.findById(responsibleId)
                .orElseThrow(() -> new IllegalArgumentException("Responsável não encontrado."));

        Child child = childRepository.findById(request.getChildId())
                .orElseThrow(() -> new IllegalArgumentException("Criança não encontrada."));

        AvailabilitySlot slot = availabilitySlotRepository.findById(request.getSlotId())
                .orElseThrow(() -> new IllegalArgumentException("Horário não encontrado."));

        validateChildBelongsToResponsible(child, responsibleId);
        validateSlotIsAvailable(slot);

        if (appointmentRepository.existsBySlotId(slot.getId())) {
            throw new IllegalArgumentException("Este horário já possui um agendamento.");
        }

        Appointment appointment = Appointment.builder()
                .responsible(responsible)
                .child(child)
                .slot(slot)
                .status(AppointmentStatus.CONFIRMED)
                .notes(request.getNotes())
                .attended(false)
                .hiddenForResponsible(false)
                .hiddenForAdmin(false)
                .build();

        Appointment savedAppointment = appointmentRepository.save(appointment);

        slot.setIsAvailable(false);
        availabilitySlotRepository.save(slot);

        return AppointmentResponse.fromEntity(savedAppointment);
    }

    /*
     * Admin lista todos os agendamentos que não foram ocultados do histórico administrativo.
     */
    @Transactional(readOnly = true)
    public List<AppointmentResponse> listAllAppointmentsForAdmin() {
        return appointmentRepository.findAllByOrderByCreatedAtDesc()
                .stream()
                .filter(appointment -> !Boolean.TRUE.equals(appointment.getHiddenForAdmin()))
                .map(AppointmentResponse::fromEntity)
                .toList();
    }

    /*
     * Responsável lista seus agendamentos não ocultos.
     */
    @Transactional(readOnly = true)
    public List<AppointmentResponse> listAppointmentsByResponsible(UUID responsibleId) {
        return appointmentRepository.findByResponsibleIdOrderByCreatedAtDesc(responsibleId)
                .stream()
                .filter(appointment -> !Boolean.TRUE.equals(appointment.getHiddenForResponsible()))
                .map(AppointmentResponse::fromEntity)
                .toList();
    }

    @Transactional
    public AppointmentResponse cancelAppointment(UUID appointmentId) {
        Appointment appointment = findAppointmentById(appointmentId);

        if (appointment.getStatus() == AppointmentStatus.CANCELLED) {
            throw new IllegalArgumentException("Este agendamento já está cancelado.");
        }

        if (appointment.getStatus() == AppointmentStatus.COMPLETED) {
            throw new IllegalArgumentException("Não é possível cancelar um atendimento já concluído.");
        }

        LocalDateTime appointmentDateTime = LocalDateTime.of(
                appointment.getSlot().getDate(),
                appointment.getSlot().getStartTime()
        );

        LocalDateTime limitToCancel = appointmentDateTime.minusHours(5);

        if (LocalDateTime.now().isAfter(limitToCancel)) {
            throw new IllegalArgumentException(
                    "O cancelamento online só é permitido até 5 horas antes do atendimento. Entre em contato com Ivina pelo WhatsApp."
            );
        }

        appointment.setStatus(AppointmentStatus.CANCELLED);
        appointment.setAttended(false);

        AvailabilitySlot slot = appointment.getSlot();
        slot.setIsAvailable(true);
        availabilitySlotRepository.save(slot);

        Appointment savedAppointment = appointmentRepository.save(appointment);

        return AppointmentResponse.fromEntity(savedAppointment);
    }

    @Transactional
    public AppointmentResponse cancelAppointmentForResponsible(
            UUID responsibleId,
            UUID appointmentId
    ) {
        Appointment appointment = findAppointmentById(appointmentId);

        validateAppointmentBelongsToResponsible(appointment, responsibleId);

        return cancelAppointment(appointmentId);
    }

    @Transactional
    public AppointmentResponse rescheduleAppointment(
            UUID appointmentId,
            RescheduleAppointmentRequest request
    ) {
        Appointment appointment = findAppointmentById(appointmentId);

        if (appointment.getStatus() == AppointmentStatus.CANCELLED) {
            throw new IllegalArgumentException("Não é possível reagendar um atendimento cancelado.");
        }

        if (appointment.getStatus() == AppointmentStatus.COMPLETED) {
            throw new IllegalArgumentException("Não é possível reagendar um atendimento já concluído.");
        }

        AvailabilitySlot oldSlot = appointment.getSlot();

        if (oldSlot.getId().equals(request.getNewSlotId())) {
            throw new IllegalArgumentException("O novo horário precisa ser diferente do horário atual.");
        }

        AvailabilitySlot newSlot = availabilitySlotRepository.findById(request.getNewSlotId())
                .orElseThrow(() -> new IllegalArgumentException("Novo horário não encontrado."));

        validateSlotIsAvailable(newSlot);

        if (appointmentRepository.existsBySlotId(newSlot.getId())) {
            throw new IllegalArgumentException("O novo horário já possui um agendamento.");
        }

        oldSlot.setIsAvailable(true);
        availabilitySlotRepository.save(oldSlot);

        newSlot.setIsAvailable(false);
        availabilitySlotRepository.save(newSlot);

        appointment.setSlot(newSlot);
        appointment.setStatus(AppointmentStatus.RESCHEDULED);

        Appointment savedAppointment = appointmentRepository.save(appointment);

        return AppointmentResponse.fromEntity(savedAppointment);
    }

    @Transactional
    public AppointmentResponse rescheduleAppointmentForResponsible(
            UUID responsibleId,
            UUID appointmentId,
            RescheduleAppointmentRequest request
    ) {
        Appointment appointment = findAppointmentById(appointmentId);

        validateAppointmentBelongsToResponsible(appointment, responsibleId);

        return rescheduleAppointment(appointmentId, request);
    }

    @Transactional
    public AppointmentResponse updateAppointmentStatus(
            UUID appointmentId,
            UpdateAppointmentStatusRequest request
    ) {
        Appointment appointment = findAppointmentById(appointmentId);

        AppointmentStatus newStatus = request.getStatus();

        if (newStatus == AppointmentStatus.PENDING) {
            throw new IllegalArgumentException("Não é permitido retornar o agendamento para PENDING nesta etapa.");
        }

        appointment.setStatus(newStatus);

        if (newStatus == AppointmentStatus.ATTENDED || newStatus == AppointmentStatus.COMPLETED) {
            appointment.setAttended(true);
        }

        if (newStatus == AppointmentStatus.MISSED || newStatus == AppointmentStatus.CANCELLED) {
            appointment.setAttended(false);
        }

        if (newStatus == AppointmentStatus.CANCELLED) {
            AvailabilitySlot slot = appointment.getSlot();
            slot.setIsAvailable(true);
            availabilitySlotRepository.save(slot);
        }

        Appointment savedAppointment = appointmentRepository.save(appointment);

        return AppointmentResponse.fromEntity(savedAppointment);
    }

    /*
     * Responsável oculta agendamento da própria área.
     */
    @Transactional
    public void hideAppointmentForResponsible(UUID responsibleId, UUID appointmentId) {
        Appointment appointment = findAppointmentById(appointmentId);

        validateAppointmentBelongsToResponsible(appointment, responsibleId);

        appointment.setHiddenForResponsible(true);

        appointmentRepository.save(appointment);
    }

    /*
     * Admin remove agendamento do histórico administrativo.
     *
     * Por segurança, só permitimos ocultar agendamentos que já não estão ativos.
     */
    @Transactional
    public void hideAppointmentForAdmin(UUID appointmentId) {
        Appointment appointment = findAppointmentById(appointmentId);

        if (
                appointment.getStatus() == AppointmentStatus.CONFIRMED ||
                appointment.getStatus() == AppointmentStatus.RESCHEDULED ||
                appointment.getStatus() == AppointmentStatus.ATTENDED
        ) {
            throw new IllegalArgumentException(
                    "Só é possível remover do histórico agendamentos cancelados, faltosos ou concluídos."
            );
        }

        appointment.setHiddenForAdmin(true);

        appointmentRepository.save(appointment);
    }

    private Appointment findAppointmentById(UUID appointmentId) {
        return appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new IllegalArgumentException("Agendamento não encontrado."));
    }

    private void validateSlotIsAvailable(AvailabilitySlot slot) {
        if (!Boolean.TRUE.equals(slot.getIsAvailable()) || Boolean.TRUE.equals(slot.getIsBlocked())) {
            throw new IllegalArgumentException("Este horário não está disponível para agendamento.");
        }
    }

    private void validateChildBelongsToResponsible(Child child, UUID responsibleId) {
        if (!child.getResponsible().getId().equals(responsibleId)) {
            throw new IllegalArgumentException("A criança informada não pertence ao responsável autenticado.");
        }
    }

    private void validateAppointmentBelongsToResponsible(Appointment appointment, UUID responsibleId) {
        if (!appointment.getResponsible().getId().equals(responsibleId)) {
            throw new IllegalArgumentException("Este agendamento não pertence ao responsável autenticado.");
        }
    }
}