package com.lttech.neuropp.controller;

import java.util.List;
import java.util.UUID;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.lttech.neuropp.dto.AppointmentResponse;
import com.lttech.neuropp.dto.CreateMyAppointmentRequest;
import com.lttech.neuropp.dto.RescheduleAppointmentRequest;
import com.lttech.neuropp.dto.UpdateAppointmentStatusRequest;
import com.lttech.neuropp.security.AuthenticatedUserService;
import com.lttech.neuropp.service.AppointmentService;

import jakarta.validation.Valid;

/*
 * Controller dos agendamentos.
 */
@RestController
@RequestMapping("/api")
public class AppointmentController {

    private final AppointmentService appointmentService;
    private final AuthenticatedUserService authenticatedUserService;

    public AppointmentController(
            AppointmentService appointmentService,
            AuthenticatedUserService authenticatedUserService
    ) {
        this.appointmentService = appointmentService;
        this.authenticatedUserService = authenticatedUserService;
    }

    /*
     * Responsável logado cria um agendamento.
     */
    @PostMapping("/appointments/my")
    public AppointmentResponse createMyAppointment(
            @Valid @RequestBody CreateMyAppointmentRequest request
    ) {
        UUID responsibleId = authenticatedUserService.getAuthenticatedUserId();

        return appointmentService.createAppointmentForResponsible(responsibleId, request);
    }

    /*
     * Responsável logado lista seus próprios agendamentos.
     */
    @GetMapping("/appointments/my")
    public List<AppointmentResponse> listMyAppointments() {
        UUID responsibleId = authenticatedUserService.getAuthenticatedUserId();

        return appointmentService.listAppointmentsByResponsible(responsibleId);
    }

    /*
     * Responsável logado cancela seu próprio agendamento.
     */
    @PutMapping("/appointments/my/{appointmentId}/cancel")
    public AppointmentResponse cancelMyAppointment(
            @PathVariable UUID appointmentId
    ) {
        UUID responsibleId = authenticatedUserService.getAuthenticatedUserId();

        return appointmentService.cancelAppointmentForResponsible(responsibleId, appointmentId);
    }

    /*
     * Responsável logado reagenda seu próprio agendamento.
     */
    @PutMapping("/appointments/my/{appointmentId}/reschedule")
    public AppointmentResponse rescheduleMyAppointment(
            @PathVariable UUID appointmentId,
            @Valid @RequestBody RescheduleAppointmentRequest request
    ) {
        UUID responsibleId = authenticatedUserService.getAuthenticatedUserId();

        return appointmentService.rescheduleAppointmentForResponsible(
                responsibleId,
                appointmentId,
                request
        );
    }

    /*
     * Responsável oculta um agendamento do próprio histórico.
     */
    @DeleteMapping("/appointments/my/{appointmentId}/history")
    public void hideMyAppointmentFromHistory(
            @PathVariable UUID appointmentId
    ) {
        UUID responsibleId = authenticatedUserService.getAuthenticatedUserId();

        appointmentService.hideAppointmentForResponsible(responsibleId, appointmentId);
    }

    /*
     * Admin lista todos os agendamentos.
     */
    @GetMapping("/admin/appointments")
    public List<AppointmentResponse> listAllAppointmentsForAdmin() {
        return appointmentService.listAllAppointmentsForAdmin();
    }

    /*
     * Admin atualiza status do agendamento.
     */
    @PutMapping("/admin/appointments/{appointmentId}/status")
    public AppointmentResponse updateAppointmentStatus(
            @PathVariable UUID appointmentId,
            @Valid @RequestBody UpdateAppointmentStatusRequest request
    ) {
        return appointmentService.updateAppointmentStatus(appointmentId, request);
    }

    /*
     * Admin remove agendamento do histórico administrativo.
     *
     * DELETE http://localhost:8080/api/admin/appointments/{appointmentId}/history
     */
    @DeleteMapping("/admin/appointments/{appointmentId}/history")
    public void hideAppointmentFromAdminHistory(
            @PathVariable UUID appointmentId
    ) {
        appointmentService.hideAppointmentForAdmin(appointmentId);
    }
}