package com.lttech.neuropp.controller;

import java.util.List;
import java.util.UUID;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.lttech.neuropp.dto.AppointmentResponse;
import com.lttech.neuropp.dto.CreateAppointmentRequest;
import com.lttech.neuropp.dto.RescheduleAppointmentRequest;
import com.lttech.neuropp.dto.UpdateAppointmentStatusRequest;
import com.lttech.neuropp.service.AppointmentService;

import jakarta.validation.Valid;

/*
 * Controller dos agendamentos.
 *
 * Ele recebe as requisições HTTP e chama o service.
 */
@RestController
@RequestMapping("/api")
public class AppointmentController {

    private final AppointmentService appointmentService;

    public AppointmentController(AppointmentService appointmentService) {
        this.appointmentService = appointmentService;
    }

    /*
     * Cria um agendamento.
     *
     * POST http://localhost:8080/api/appointments
     */
    @PostMapping("/appointments")
    public AppointmentResponse createAppointment(
            @Valid @RequestBody CreateAppointmentRequest request
    ) {
        return appointmentService.createAppointment(request);
    }

    /*
     * Lista todos os agendamentos para o painel admin.
     *
     * GET http://localhost:8080/api/admin/appointments
     */
    @GetMapping("/admin/appointments")
    public List<AppointmentResponse> listAllAppointmentsForAdmin() {
        return appointmentService.listAllAppointmentsForAdmin();
    }

    /*
     * Lista agendamentos de um responsável.
     *
     * GET http://localhost:8080/api/appointments/responsible/{responsibleId}
     */
    @GetMapping("/appointments/responsible/{responsibleId}")
    public List<AppointmentResponse> listAppointmentsByResponsible(
            @PathVariable UUID responsibleId
    ) {
        return appointmentService.listAppointmentsByResponsible(responsibleId);
    }

    /*
     * Cancelamento feito pelo responsável.
     *
     * PUT http://localhost:8080/api/appointments/{appointmentId}/cancel
     */
    @PutMapping("/appointments/{appointmentId}/cancel")
    public AppointmentResponse cancelAppointment(
            @PathVariable UUID appointmentId
    ) {
        return appointmentService.cancelAppointment(appointmentId);
    }

    /*
     * Reagendamento feito pelo responsável.
     *
     * PUT http://localhost:8080/api/appointments/{appointmentId}/reschedule
     */
    @PutMapping("/appointments/{appointmentId}/reschedule")
    public AppointmentResponse rescheduleAppointment(
            @PathVariable UUID appointmentId,
            @Valid @RequestBody RescheduleAppointmentRequest request
    ) {
        return appointmentService.rescheduleAppointment(appointmentId, request);
    }

    /*
     * Atualização de status feita pela admin.
     *
     * PUT http://localhost:8080/api/admin/appointments/{appointmentId}/status
     */
    @PutMapping("/admin/appointments/{appointmentId}/status")
    public AppointmentResponse updateAppointmentStatus(
            @PathVariable UUID appointmentId,
            @Valid @RequestBody UpdateAppointmentStatusRequest request
    ) {
        return appointmentService.updateAppointmentStatus(appointmentId, request);
    }
}