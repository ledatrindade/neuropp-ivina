package com.lttech.neuropp.service;

import com.lttech.neuropp.dto.AvailabilitySlotResponse;
import com.lttech.neuropp.dto.CreateAvailabilitySlotRequest;
import com.lttech.neuropp.dto.UpdateAvailabilitySlotRequest;
import com.lttech.neuropp.entity.AvailabilitySlot;
import com.lttech.neuropp.exception.BusinessConflictException;
import com.lttech.neuropp.exception.BusinessRuleException;
import com.lttech.neuropp.exception.ResourceNotFoundException;
import com.lttech.neuropp.mapper.AvailabilitySlotMapper;
import com.lttech.neuropp.repository.AppointmentRepository;
import com.lttech.neuropp.repository.AvailabilitySlotRepository;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Clock;
import java.time.Duration;
import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import java.util.UUID;

@Service
public class AvailabilitySlotService {

    private static final Duration MINIMUM_DURATION = Duration.ofMinutes(15);
    private static final Duration MAXIMUM_DURATION = Duration.ofHours(8);

    private final AvailabilitySlotRepository availabilitySlotRepository;
    private final AppointmentRepository appointmentRepository;
    private final AppointmentStatusPolicy statusPolicy;
    private final AvailabilitySlotMapper slotMapper;
    private final Clock clock;

    public AvailabilitySlotService(
            AvailabilitySlotRepository availabilitySlotRepository,
            AppointmentRepository appointmentRepository,
            AppointmentStatusPolicy statusPolicy,
            AvailabilitySlotMapper slotMapper,
            Clock clock
    ) {
        this.availabilitySlotRepository = availabilitySlotRepository;
        this.appointmentRepository = appointmentRepository;
        this.statusPolicy = statusPolicy;
        this.slotMapper = slotMapper;
        this.clock = clock;
    }

    @Transactional
    public AvailabilitySlotResponse createSlot(CreateAvailabilitySlotRequest request) {
        validateDateAndTime(request.date(), request.startTime(), request.endTime());


        if (availabilitySlotRepository.existsOverlapping(
                request.date(),
                request.startTime(),
                request.endTime()
        )) {
            throw new BusinessConflictException(
                    "O novo horário se sobrepõe a outro horário já cadastrado."
            );
        }

        AvailabilitySlot slot = AvailabilitySlot.builder()
                .date(request.date())
                .startTime(request.startTime())
                .endTime(request.endTime())
                .isAvailable(true)
                .isBlocked(false)
                .build();

        try {
            return slotMapper.toResponse(availabilitySlotRepository.saveAndFlush(slot));
        } catch (DataIntegrityViolationException exception) {
            throw new BusinessConflictException(
                    "O novo horário se sobrepõe a outro horário cadastrado."
            );
        }
    }

    @Transactional(readOnly = true)
    public List<AvailabilitySlotResponse> listAvailableSlotsByDate(LocalDate date) {
        return availabilitySlotRepository
                .findByDateAndIsAvailableTrueAndIsBlockedFalseAndDeletedAtIsNullOrderByStartTimeAsc(date)
                .stream()
                .filter(this::hasNotStarted)
                .map(slotMapper::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<AvailabilitySlotResponse> listAllSlotsByDate(LocalDate date) {
        return availabilitySlotRepository.findByDateAndDeletedAtIsNullOrderByStartTimeAsc(date)
                .stream()
                .map(slotMapper::toResponse)
                .toList();
    }

    @Transactional
    public AvailabilitySlotResponse updateSlot(
            UUID slotId,
            UpdateAvailabilitySlotRequest request
    ) {
        AvailabilitySlot slot = findSlotForUpdate(slotId);

        if (!appointmentRepository.findBySlotId(slotId).isEmpty()) {
            throw new BusinessConflictException(
                    "Um horário que já faz parte do histórico de agendamentos não pode ter data ou hora alteradas."
            );
        }

        validateDateAndTime(request.date(), request.startTime(), request.endTime());

        if (availabilitySlotRepository.existsOverlappingExcludingId(
                request.date(),
                request.startTime(),
                request.endTime(),
                slotId
        )) {
            throw new BusinessConflictException(
                    "O horário editado se sobrepõe a outro horário já cadastrado."
            );
        }

        slot.setDate(request.date());
        slot.setStartTime(request.startTime());
        slot.setEndTime(request.endTime());

        try {
            return slotMapper.toResponse(availabilitySlotRepository.saveAndFlush(slot));
        } catch (DataIntegrityViolationException exception) {
            throw new BusinessConflictException(
                    "O horário editado se sobrepõe a outro horário cadastrado."
            );
        }
    }

    @Transactional
    public AvailabilitySlotResponse blockSlot(UUID slotId) {
        AvailabilitySlot slot = findSlotForUpdate(slotId);
        assertNoActiveAppointment(slotId);

        slot.setIsBlocked(true);
        slot.setIsAvailable(false);

        return slotMapper.toResponse(availabilitySlotRepository.save(slot));
    }

    @Transactional
    public AvailabilitySlotResponse unblockSlot(UUID slotId) {
        AvailabilitySlot slot = findSlotForUpdate(slotId);
        assertNoActiveAppointment(slotId);

        if (!hasNotStarted(slot)) {
            throw new BusinessRuleException("Não é possível disponibilizar um horário que já começou.");
        }

        slot.setIsBlocked(false);
        slot.setIsAvailable(true);

        return slotMapper.toResponse(availabilitySlotRepository.save(slot));
    }

    @Transactional
    public void deleteSlot(UUID slotId) {
        AvailabilitySlot slot = findSlotForUpdate(slotId);
        assertNoActiveAppointment(slotId);

        slot.setDeletedAt(Instant.now(clock));
        slot.setIsBlocked(true);
        slot.setIsAvailable(false);
        availabilitySlotRepository.save(slot);
    }

    private AvailabilitySlot findSlotForUpdate(UUID slotId) {
        return availabilitySlotRepository.findByIdForUpdate(slotId)
                .orElseThrow(() -> new ResourceNotFoundException("Horário não encontrado."));
    }

    private void assertNoActiveAppointment(UUID slotId) {
        if (appointmentRepository.existsBySlotIdAndStatusIn(slotId, statusPolicy.activeStatuses())) {
            throw new BusinessConflictException(
                    "O horário possui um agendamento ativo e não pode ser alterado desta forma."
            );
        }
    }

    private void validateDateAndTime(LocalDate date, LocalTime startTime, LocalTime endTime) {
        if (!endTime.isAfter(startTime)) {
            throw new BusinessRuleException("O horário final precisa ser posterior ao inicial.");
        }

        Duration duration = Duration.between(startTime, endTime);
        if (duration.compareTo(MINIMUM_DURATION) < 0) {
            throw new BusinessRuleException("O horário deve ter pelo menos 15 minutos.");
        }
        if (duration.compareTo(MAXIMUM_DURATION) > 0) {
            throw new BusinessRuleException("O horário não pode ultrapassar 8 horas.");
        }

        LocalDateTime startsAt = LocalDateTime.of(date, startTime);
        if (!startsAt.isAfter(LocalDateTime.now(clock))) {
            throw new BusinessRuleException("O início do horário precisa estar no futuro.");
        }
    }

    private boolean hasNotStarted(AvailabilitySlot slot) {
        return LocalDateTime.of(slot.getDate(), slot.getStartTime())
                .isAfter(LocalDateTime.now(clock));
    }
}
