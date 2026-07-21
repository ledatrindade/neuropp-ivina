package com.lttech.neuropp.controller;

import com.lttech.neuropp.dto.AvailabilitySlotResponse;
import com.lttech.neuropp.dto.CreateAvailabilitySlotRequest;
import com.lttech.neuropp.dto.UpdateAvailabilitySlotRequest;
import com.lttech.neuropp.service.AvailabilitySlotService;
import jakarta.validation.Valid;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
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

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api")
public class AvailabilitySlotController {

    private final AvailabilitySlotService availabilitySlotService;

    public AvailabilitySlotController(AvailabilitySlotService availabilitySlotService) {
        this.availabilitySlotService = availabilitySlotService;
    }

    @PostMapping("/admin/availability")
    @ResponseStatus(HttpStatus.CREATED)
    public AvailabilitySlotResponse createSlot(
            @Valid @RequestBody CreateAvailabilitySlotRequest request
    ) {
        return availabilitySlotService.createSlot(request);
    }

    @GetMapping("/availability")
    public List<AvailabilitySlotResponse> listAvailableSlots(
            @RequestParam
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
            LocalDate date
    ) {
        return availabilitySlotService.listAvailableSlotsByDate(date);
    }

    @GetMapping("/admin/availability")
    public List<AvailabilitySlotResponse> listAllSlotsForAdmin(
            @RequestParam
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
            LocalDate date
    ) {
        return availabilitySlotService.listAllSlotsByDate(date);
    }

    @PutMapping("/admin/availability/{slotId}")
    public AvailabilitySlotResponse updateSlot(
            @PathVariable UUID slotId,
            @Valid @RequestBody UpdateAvailabilitySlotRequest request
    ) {
        return availabilitySlotService.updateSlot(slotId, request);
    }

    @PutMapping("/admin/availability/{slotId}/block")
    public AvailabilitySlotResponse blockSlot(@PathVariable UUID slotId) {
        return availabilitySlotService.blockSlot(slotId);
    }

    @PutMapping("/admin/availability/{slotId}/unblock")
    public AvailabilitySlotResponse unblockSlot(@PathVariable UUID slotId) {
        return availabilitySlotService.unblockSlot(slotId);
    }

    @DeleteMapping("/admin/availability/{slotId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteSlot(@PathVariable UUID slotId) {
        availabilitySlotService.deleteSlot(slotId);
    }
}
