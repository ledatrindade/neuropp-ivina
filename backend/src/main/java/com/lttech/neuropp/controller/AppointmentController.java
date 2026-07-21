package com.lttech.neuropp.controller;

import com.lttech.neuropp.dto.AppointmentResponse;
import com.lttech.neuropp.dto.CreateMyAppointmentRequest;
import com.lttech.neuropp.dto.PageResponse;
import com.lttech.neuropp.dto.RescheduleAppointmentRequest;
import com.lttech.neuropp.dto.UpdateAppointmentStatusRequest;
import com.lttech.neuropp.security.AuthenticatedUserService;
import com.lttech.neuropp.service.AppointmentService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import java.util.UUID;

@Validated
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

    @PostMapping("/appointments/my")
    @ResponseStatus(HttpStatus.CREATED)
    public AppointmentResponse createMyAppointment(
            @Valid @RequestBody CreateMyAppointmentRequest request
    ) {
        UUID responsibleId = authenticatedUserService.getAuthenticatedUserId();
        return appointmentService.createAppointmentForResponsible(responsibleId, request);
    }

    @GetMapping("/appointments/my")
    public PageResponse<AppointmentResponse> listMyAppointments(
            @RequestParam(defaultValue = "0") @Min(0) int page,
            @RequestParam(defaultValue = "20") @Min(1) @Max(100) int size
    ) {
        UUID responsibleId = authenticatedUserService.getAuthenticatedUserId();
        return appointmentService.listAppointmentsByResponsible(
                responsibleId,
                PageRequest.of(page, size)
        );
    }

    @PutMapping("/appointments/my/{appointmentId}/cancel")
    public AppointmentResponse cancelMyAppointment(@PathVariable UUID appointmentId) {
        UUID responsibleId = authenticatedUserService.getAuthenticatedUserId();
        return appointmentService.cancelAppointmentForResponsible(responsibleId, appointmentId);
    }

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

    @DeleteMapping("/appointments/my/{appointmentId}/history")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void hideMyAppointmentFromHistory(@PathVariable UUID appointmentId) {
        UUID responsibleId = authenticatedUserService.getAuthenticatedUserId();
        appointmentService.hideAppointmentForResponsible(responsibleId, appointmentId);
    }

    @GetMapping("/admin/appointments")
    public PageResponse<AppointmentResponse> listAllAppointmentsForAdmin(
            @RequestParam(defaultValue = "0") @Min(0) int page,
            @RequestParam(defaultValue = "20") @Min(1) @Max(100) int size
    ) {
        return appointmentService.listAllAppointmentsForAdmin(PageRequest.of(page, size));
    }

    @PutMapping("/admin/appointments/{appointmentId}/status")
    public AppointmentResponse updateAppointmentStatus(
            @PathVariable UUID appointmentId,
            @Valid @RequestBody UpdateAppointmentStatusRequest request
    ) {
        return appointmentService.updateAppointmentStatus(appointmentId, request);
    }

    @DeleteMapping("/admin/appointments/{appointmentId}/history")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void hideAppointmentFromAdminHistory(@PathVariable UUID appointmentId) {
        appointmentService.hideAppointmentForAdmin(appointmentId);
    }
}
