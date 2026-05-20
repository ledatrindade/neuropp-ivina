package com.lttech.neuropp.controller;

import java.time.LocalDate;
import java.util.List;

import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.lttech.neuropp.dto.AvailabilitySlotResponse;
import com.lttech.neuropp.dto.CreateAvailabilitySlotRequest;
import com.lttech.neuropp.service.AvailabilitySlotService;

import jakarta.validation.Valid;

/*
 * Controller da agenda.
 *
 * Aqui ficam as rotas HTTP relacionadas aos horários disponíveis.
 */
@RestController
@RequestMapping("/api")
public class AvailabilitySlotController {

    private final AvailabilitySlotService availabilitySlotService;

    public AvailabilitySlotController(AvailabilitySlotService availabilitySlotService) {
        this.availabilitySlotService = availabilitySlotService;
    }

    /*
     * Rota para criar horário disponível.
     *
     * Futuramente, essa rota será protegida e apenas ADMIN poderá acessar.
     *
     * Exemplo:
     * POST http://localhost:8080/api/admin/availability
     */
    @PostMapping("/admin/availability")
    public AvailabilitySlotResponse createSlot(
            @Valid @RequestBody CreateAvailabilitySlotRequest request
    ) {
        return availabilitySlotService.createSlot(request);
    }

    /*
     * Rota pública para listar horários disponíveis por data.
     *
     * Exemplo:
     * GET http://localhost:8080/api/availability?date=2026-05-23
     */
    @GetMapping("/availability")
    public List<AvailabilitySlotResponse> listAvailableSlots(
            @RequestParam
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
            LocalDate date
    ) {
        return availabilitySlotService.listAvailableSlotsByDate(date);
    }

    /*
     * Rota administrativa para listar todos os horários de uma data.
     *
     * Futuramente será protegida para ADMIN.
     *
     * Exemplo:
     * GET http://localhost:8080/api/admin/availability?date=2026-05-23
     */
    @GetMapping("/admin/availability")
    public List<AvailabilitySlotResponse> listAllSlotsForAdmin(
            @RequestParam
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
            LocalDate date
    ) {
        return availabilitySlotService.listAllSlotsByDate(date);
    }
}