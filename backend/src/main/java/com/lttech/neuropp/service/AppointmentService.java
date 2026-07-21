package com.lttech.neuropp.service;

import com.lttech.neuropp.dto.AppointmentResponse;
import com.lttech.neuropp.dto.CreateMyAppointmentRequest;
import com.lttech.neuropp.dto.PageResponse;
import com.lttech.neuropp.dto.RescheduleAppointmentRequest;
import com.lttech.neuropp.dto.UpdateAppointmentStatusRequest;
import com.lttech.neuropp.entity.Appointment;
import com.lttech.neuropp.entity.AvailabilitySlot;
import com.lttech.neuropp.entity.Child;
import com.lttech.neuropp.entity.User;
import com.lttech.neuropp.enums.AppointmentStatus;
import com.lttech.neuropp.enums.UserRole;
import com.lttech.neuropp.exception.BusinessConflictException;
import com.lttech.neuropp.exception.BusinessRuleException;
import com.lttech.neuropp.exception.ForbiddenOperationException;
import com.lttech.neuropp.exception.ResourceNotFoundException;
import com.lttech.neuropp.mapper.AppointmentMapper;
import com.lttech.neuropp.repository.AppointmentRepository;
import com.lttech.neuropp.repository.AvailabilitySlotRepository;
import com.lttech.neuropp.repository.ChildRepository;
import com.lttech.neuropp.repository.UserRepository;
import com.lttech.neuropp.util.InputNormalizer;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Clock;
import java.time.Instant;
import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
public class AppointmentService {

    private static final long ONLINE_CHANGE_LIMIT_HOURS = 5;

    private final AppointmentRepository appointmentRepository;
    private final UserRepository userRepository;
    private final ChildRepository childRepository;
    private final AvailabilitySlotRepository availabilitySlotRepository;
    private final AppointmentMapper appointmentMapper;
    private final AppointmentStatusPolicy statusPolicy;
    private final Clock clock;

    public AppointmentService(
            AppointmentRepository appointmentRepository,
            UserRepository userRepository,
            ChildRepository childRepository,
            AvailabilitySlotRepository availabilitySlotRepository,
            AppointmentMapper appointmentMapper,
            AppointmentStatusPolicy statusPolicy,
            Clock clock
    ) {
        this.appointmentRepository = appointmentRepository;
        this.userRepository = userRepository;
        this.childRepository = childRepository;
        this.availabilitySlotRepository = availabilitySlotRepository;
        this.appointmentMapper = appointmentMapper;
        this.statusPolicy = statusPolicy;
        this.clock = clock;
    }

    @Transactional
    public AppointmentResponse createAppointmentForResponsible(
            UUID responsibleId,
            CreateMyAppointmentRequest request
    ) {
        User responsible = findActiveResponsible(responsibleId);

        Child child = childRepository.findByIdAndResponsibleId(request.childId(), responsibleId)
                .orElseThrow(() -> new ResourceNotFoundException("Criança não encontrada."));

        AvailabilitySlot slot = findSlotForUpdate(request.slotId());
        validateSlotCanBeBooked(slot);

        if (appointmentRepository.existsBySlotIdAndStatusIn(
                slot.getId(),
                statusPolicy.activeStatuses()
        )) {
            throw new BusinessConflictException("Este horário já possui um agendamento ativo.");
        }

        slot.setIsAvailable(false);

        Appointment appointment = Appointment.builder()
                .responsible(responsible)
                .child(child)
                .slot(slot)
                .status(AppointmentStatus.PENDING)
                .notes(InputNormalizer.optionalText(request.notes()))
                .hiddenForResponsible(false)
                .hiddenForAdmin(false)
                .build();

        try {
            availabilitySlotRepository.save(slot);
            Appointment saved = appointmentRepository.saveAndFlush(appointment);
            return appointmentMapper.toResponse(saved);
        } catch (DataIntegrityViolationException exception) {
            throw new BusinessConflictException(
                    "O horário acabou de ser reservado por outra solicitação. Escolha outro horário."
            );
        }
    }

    @Transactional(readOnly = true)
    public PageResponse<AppointmentResponse> listAllAppointmentsForAdmin(Pageable pageable) {
        Page<AppointmentResponse> page = appointmentRepository
                .findByHiddenForAdminFalseOrderByCreatedAtDesc(pageable)
                .map(appointmentMapper::toResponse);
        return PageResponse.from(page);
    }

    @Transactional(readOnly = true)
    public PageResponse<AppointmentResponse> listAppointmentsByResponsible(
            UUID responsibleId,
            Pageable pageable
    ) {
        Page<AppointmentResponse> page = appointmentRepository
                .findByResponsibleIdAndHiddenForResponsibleFalseOrderByCreatedAtDesc(
                        responsibleId,
                        pageable
                )
                .map(appointmentMapper::toResponse);
        return PageResponse.from(page);
    }

    @Transactional
    public AppointmentResponse cancelAppointmentForResponsible(
            UUID responsibleId,
            UUID appointmentId
    ) {
        Appointment appointment = appointmentRepository
                .findByIdAndResponsibleIdForUpdate(appointmentId, responsibleId)
                .orElseThrow(() -> new ResourceNotFoundException("Agendamento não encontrado."));

        statusPolicy.assertCanCancel(appointment.getStatus());
        assertOutsideOnlineChangeLimit(appointment);

        AvailabilitySlot slot = findSlotForUpdate(appointment.getSlot().getId());

        appointment.setStatus(AppointmentStatus.CANCELLED);
        appointment.setCancelledAt(Instant.now(clock));

        if (!Boolean.TRUE.equals(slot.getIsBlocked()) && slot.getDeletedAt() == null) {
            slot.setIsAvailable(true);
        }

        availabilitySlotRepository.save(slot);
        return appointmentMapper.toResponse(appointmentRepository.save(appointment));
    }

    @Transactional
    public AppointmentResponse rescheduleAppointmentForResponsible(
            UUID responsibleId,
            UUID appointmentId,
            RescheduleAppointmentRequest request
    ) {
        Appointment appointment = appointmentRepository
                .findByIdAndResponsibleIdForUpdate(appointmentId, responsibleId)
                .orElseThrow(() -> new ResourceNotFoundException("Agendamento não encontrado."));

        statusPolicy.assertCanReschedule(appointment.getStatus());
        assertOutsideOnlineChangeLimit(appointment);

        UUID oldSlotId = appointment.getSlot().getId();
        UUID newSlotId = request.newSlotId();

        if (oldSlotId.equals(newSlotId)) {
            throw new BusinessRuleException("O novo horário precisa ser diferente do atual.");
        }

        Map<UUID, AvailabilitySlot> lockedSlots = lockSlotsInStableOrder(oldSlotId, newSlotId);
        AvailabilitySlot oldSlot = lockedSlots.get(oldSlotId);
        AvailabilitySlot newSlot = lockedSlots.get(newSlotId);

        validateSlotCanBeBooked(newSlot);

        if (appointmentRepository.existsBySlotIdAndStatusIn(
                newSlotId,
                statusPolicy.activeStatuses()
        )) {
            throw new BusinessConflictException("O novo horário já possui um agendamento ativo.");
        }

        if (!Boolean.TRUE.equals(oldSlot.getIsBlocked()) && oldSlot.getDeletedAt() == null) {
            oldSlot.setIsAvailable(true);
        }
        newSlot.setIsAvailable(false);

        appointment.setSlot(newSlot);
        appointment.setStatus(AppointmentStatus.RESCHEDULED);
        appointment.setRescheduledAt(Instant.now(clock));

        try {
            availabilitySlotRepository.saveAll(List.of(oldSlot, newSlot));
            return appointmentMapper.toResponse(appointmentRepository.saveAndFlush(appointment));
        } catch (DataIntegrityViolationException exception) {
            throw new BusinessConflictException(
                    "O novo horário acabou de ser reservado. Escolha outro horário."
            );
        }
    }

    @Transactional
    public AppointmentResponse updateAppointmentStatus(
            UUID appointmentId,
            UpdateAppointmentStatusRequest request
    ) {
        Appointment appointment = appointmentRepository.findByIdForUpdate(appointmentId)
                .orElseThrow(() -> new ResourceNotFoundException("Agendamento não encontrado."));

        AppointmentStatus target = request.status();
        statusPolicy.assertTransitionAllowed(appointment.getStatus(), target);
        validateTemporalTransition(appointment, target);

        if (target == AppointmentStatus.CANCELLED) {
            AvailabilitySlot slot = findSlotForUpdate(appointment.getSlot().getId());
            if (!Boolean.TRUE.equals(slot.getIsBlocked()) && slot.getDeletedAt() == null) {
                slot.setIsAvailable(true);
            }
            availabilitySlotRepository.save(slot);
            appointment.setCancelledAt(Instant.now(clock));
        }

        if (target == AppointmentStatus.COMPLETED) {
            appointment.setCompletedAt(Instant.now(clock));
        }

        appointment.setStatus(target);
        return appointmentMapper.toResponse(appointmentRepository.save(appointment));
    }

    @Transactional
    public void hideAppointmentForResponsible(UUID responsibleId, UUID appointmentId) {
        Appointment appointment = appointmentRepository
                .findByIdAndResponsibleIdForUpdate(appointmentId, responsibleId)
                .orElseThrow(() -> new ResourceNotFoundException("Agendamento não encontrado."));

        statusPolicy.assertCanHide(appointment.getStatus());
        appointment.setHiddenForResponsible(true);
        appointmentRepository.save(appointment);
    }

    @Transactional
    public void hideAppointmentForAdmin(UUID appointmentId) {
        Appointment appointment = appointmentRepository.findByIdForUpdate(appointmentId)
                .orElseThrow(() -> new ResourceNotFoundException("Agendamento não encontrado."));

        statusPolicy.assertCanHide(appointment.getStatus());
        appointment.setHiddenForAdmin(true);
        appointmentRepository.save(appointment);
    }

    private User findActiveResponsible(UUID responsibleId) {
        User user = userRepository.findById(responsibleId)
                .orElseThrow(() -> new ResourceNotFoundException("Responsável não encontrado."));

        if (!Boolean.TRUE.equals(user.getActive()) || user.getRole() != UserRole.RESPONSIBLE) {
            throw new ForbiddenOperationException("A conta não está autorizada a agendar.");
        }

        return user;
    }

    private AvailabilitySlot findSlotForUpdate(UUID slotId) {
        return availabilitySlotRepository.findByIdForUpdate(slotId)
                .orElseThrow(() -> new ResourceNotFoundException("Horário não encontrado."));
    }

    private Map<UUID, AvailabilitySlot> lockSlotsInStableOrder(UUID firstId, UUID secondId) {
        List<UUID> ids = List.of(firstId, secondId).stream()
                .sorted(Comparator.comparing(UUID::toString))
                .toList();

        Map<UUID, AvailabilitySlot> slots = new HashMap<>();
        for (UUID id : ids) {
            slots.put(id, findSlotForUpdate(id));
        }
        return slots;
    }

    private void validateSlotCanBeBooked(AvailabilitySlot slot) {
        if (slot.getDeletedAt() != null
                || Boolean.TRUE.equals(slot.getIsBlocked())
                || !Boolean.TRUE.equals(slot.getIsAvailable())) {
            throw new BusinessConflictException("Este horário não está disponível para agendamento.");
        }

        LocalDateTime startsAt = LocalDateTime.of(slot.getDate(), slot.getStartTime());
        if (!startsAt.isAfter(LocalDateTime.now(clock))) {
            throw new BusinessRuleException("Não é possível agendar um horário que já começou.");
        }
    }


    private void validateTemporalTransition(
            Appointment appointment,
            AppointmentStatus target
    ) {
        if (target != AppointmentStatus.ATTENDED && target != AppointmentStatus.MISSED) {
            return;
        }

        LocalDateTime startsAt = LocalDateTime.of(
                appointment.getSlot().getDate(),
                appointment.getSlot().getStartTime()
        );

        if (LocalDateTime.now(clock).isBefore(startsAt)) {
            throw new BusinessRuleException(
                    "O atendimento não pode ser marcado como realizado ou faltoso antes do horário de início."
            );
        }
    }

    private void assertOutsideOnlineChangeLimit(Appointment appointment) {
        LocalDateTime startsAt = LocalDateTime.of(
                appointment.getSlot().getDate(),
                appointment.getSlot().getStartTime()
        );
        LocalDateTime limit = startsAt.minusHours(ONLINE_CHANGE_LIMIT_HOURS);

        if (LocalDateTime.now(clock).isAfter(limit)) {
            throw new BusinessRuleException(
                    "Alterações online são permitidas até 5 horas antes do atendimento. Entre em contato pelo WhatsApp."
            );
        }
    }
}
