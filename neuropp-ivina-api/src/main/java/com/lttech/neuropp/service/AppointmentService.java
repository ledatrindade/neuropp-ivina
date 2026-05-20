package com.lttech.neuropp.service;

import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;

import com.lttech.neuropp.dto.AppointmentResponse;
import com.lttech.neuropp.dto.CreateAppointmentRequest;
import com.lttech.neuropp.entity.Appointment;
import com.lttech.neuropp.entity.AvailabilitySlot;
import com.lttech.neuropp.entity.Child;
import com.lttech.neuropp.entity.User;
import com.lttech.neuropp.enums.AppointmentStatus;
import com.lttech.neuropp.repository.AppointmentRepository;
import com.lttech.neuropp.repository.AvailabilitySlotRepository;
import com.lttech.neuropp.repository.ChildRepository;
import com.lttech.neuropp.repository.UserRepository;

import jakarta.transaction.Transactional;

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

    /*
     * @Transactional significa:
     * ou tudo dá certo, ou nada é salvo.
     *
     * Isso é importante porque ao criar um agendamento,
     * também precisamos marcar o horário como indisponível.
     */
    @Transactional
    public AppointmentResponse createAppointment(CreateAppointmentRequest request) {

        User responsible = userRepository.findById(request.getResponsibleId())
                .orElseThrow(() -> new IllegalArgumentException("Responsável não encontrado."));

        Child child = childRepository.findById(request.getChildId())
                .orElseThrow(() -> new IllegalArgumentException("Criança não encontrada."));

        AvailabilitySlot slot = availabilitySlotRepository.findById(request.getSlotId())
                .orElseThrow(() -> new IllegalArgumentException("Horário não encontrado."));

        /*
         * Regra de segurança:
         * a criança precisa pertencer ao responsável informado.
         */
        if (!child.getResponsible().getId().equals(responsible.getId())) {
            throw new IllegalArgumentException("A criança informada não pertence a este responsável.");
        }

        /*
         * Regra de negócio:
         * o horário precisa estar disponível e não bloqueado.
         */
        if (!Boolean.TRUE.equals(slot.getIsAvailable()) || Boolean.TRUE.equals(slot.getIsBlocked())) {
            throw new IllegalArgumentException("Este horário não está disponível para agendamento.");
        }

        /*
         * Regra extra:
         * não pode existir outro agendamento para o mesmo horário.
         */
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
                .build();

        Appointment savedAppointment = appointmentRepository.save(appointment);

        /*
         * Bloqueio automático do horário.
         *
         * Depois que o horário vira agendamento, ele não deve mais aparecer
         * na listagem pública de horários disponíveis.
         */
        slot.setIsAvailable(false);
        availabilitySlotRepository.save(slot);

        return AppointmentResponse.fromEntity(savedAppointment);
    }

    public List<AppointmentResponse> listAllAppointmentsForAdmin() {
        return appointmentRepository.findAll()
                .stream()
                .map(AppointmentResponse::fromEntity)
                .toList();
    }

    public List<AppointmentResponse> listAppointmentsByResponsible(UUID responsibleId) {
        return appointmentRepository.findByResponsibleIdOrderByCreatedAtDesc(responsibleId)
                .stream()
                .map(AppointmentResponse::fromEntity)
                .toList();
    }
}