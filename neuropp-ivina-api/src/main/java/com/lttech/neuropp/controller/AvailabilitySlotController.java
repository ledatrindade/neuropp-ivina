package com.lttech.neuropp.controller;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.lttech.neuropp.dto.AvailabilitySlotResponse;
import com.lttech.neuropp.dto.CreateAvailabilitySlotRequest;
import com.lttech.neuropp.dto.UpdateAvailabilitySlotRequest;
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
     * Admin cria horário disponível.
     *
     * POST http://localhost:8080/api/admin/availability
     */
    @PostMapping("/admin/availability")
    public AvailabilitySlotResponse createSlot(
            @Valid @RequestBody CreateAvailabilitySlotRequest request
    ) {
        return availabilitySlotService.createSlot(request);
    }

    /*
     * Site público lista horários disponíveis.
     *
     * GET http://localhost:8080/api/availability?date=2026-06-20
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
     * Admin lista todos os horários de uma data.
     *
     * GET http://localhost:8080/api/admin/availability?date=2026-06-20
     */
    @GetMapping("/admin/availability")
    public List<AvailabilitySlotResponse> listAllSlotsForAdmin(
            @RequestParam
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
            LocalDate date
    ) {
        return availabilitySlotService.listAllSlotsByDate(date);
    }

    /*
     * Admin edita um horário.
     *
     * PUT http://localhost:8080/api/admin/availability/{slotId}
     */
    @PutMapping("/admin/availability/{slotId}")
    public AvailabilitySlotResponse updateSlot(
            @PathVariable UUID slotId,
            @Valid @RequestBody UpdateAvailabilitySlotRequest request
    ) {
        return availabilitySlotService.updateSlot(slotId, request);
    }

    /*
     * Admin bloqueia um horário.
     *
     * PUT http://localhost:8080/api/admin/availability/{slotId}/block
     */
    @PutMapping("/admin/availability/{slotId}/block")
    public AvailabilitySlotResponse blockSlot(
            @PathVariable UUID slotId
    ) {
        return availabilitySlotService.blockSlot(slotId);
    }

    /*
     * Admin desbloqueia um horário.
     *
     * PUT http://localhost:8080/api/admin/availability/{slotId}/unblock
     */
    @PutMapping("/admin/availability/{slotId}/unblock")
    public AvailabilitySlotResponse unblockSlot(
            @PathVariable UUID slotId
    ) {
        return availabilitySlotService.unblockSlot(slotId);
    }

    /*
     * Admin exclui um horário.
     *
     * DELETE http://localhost:8080/api/admin/availability/{slotId}
     */
    @DeleteMapping("/admin/availability/{slotId}")
    public void deleteSlot(
            @PathVariable UUID slotId
    ) {
        availabilitySlotService.deleteSlot(slotId);
    }
}