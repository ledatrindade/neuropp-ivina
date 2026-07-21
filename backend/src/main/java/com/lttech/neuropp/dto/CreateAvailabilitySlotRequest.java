package com.lttech.neuropp.dto;

import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;
import java.time.LocalTime;

public record CreateAvailabilitySlotRequest(
        @NotNull(message = "A data é obrigatória.")
        @FutureOrPresent(message = "A data do horário não pode estar no passado.")
        LocalDate date,

        @NotNull(message = "O horário inicial é obrigatório.")
        LocalTime startTime,

        @NotNull(message = "O horário final é obrigatório.")
        LocalTime endTime
) {
}
