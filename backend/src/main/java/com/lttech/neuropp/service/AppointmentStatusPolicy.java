package com.lttech.neuropp.service;

import com.lttech.neuropp.enums.AppointmentStatus;
import com.lttech.neuropp.exception.BusinessRuleException;
import org.springframework.stereotype.Component;

import java.util.EnumSet;
import java.util.Map;
import java.util.Set;

@Component
public class AppointmentStatusPolicy {

    private static final Set<AppointmentStatus> ACTIVE_STATUSES = Set.copyOf(EnumSet.of(
            AppointmentStatus.PENDING,
            AppointmentStatus.CONFIRMED,
            AppointmentStatus.RESCHEDULED,
            AppointmentStatus.ATTENDED
    ));

    private static final Set<AppointmentStatus> TERMINAL_STATUSES = Set.copyOf(EnumSet.of(
            AppointmentStatus.CANCELLED,
            AppointmentStatus.MISSED,
            AppointmentStatus.COMPLETED
    ));

    private static final Map<AppointmentStatus, Set<AppointmentStatus>> TRANSITIONS = Map.of(
            AppointmentStatus.PENDING, EnumSet.of(
                    AppointmentStatus.CONFIRMED,
                    AppointmentStatus.CANCELLED
            ),
            AppointmentStatus.CONFIRMED, EnumSet.of(
                    AppointmentStatus.ATTENDED,
                    AppointmentStatus.MISSED,
                    AppointmentStatus.CANCELLED
            ),
            AppointmentStatus.RESCHEDULED, EnumSet.of(
                    AppointmentStatus.CONFIRMED,
                    AppointmentStatus.CANCELLED
            ),
            AppointmentStatus.ATTENDED, EnumSet.of(
                    AppointmentStatus.COMPLETED
            ),
            AppointmentStatus.CANCELLED, EnumSet.noneOf(AppointmentStatus.class),
            AppointmentStatus.MISSED, EnumSet.noneOf(AppointmentStatus.class),
            AppointmentStatus.COMPLETED, EnumSet.noneOf(AppointmentStatus.class)
    );

    public Set<AppointmentStatus> activeStatuses() {
        return ACTIVE_STATUSES;
    }

    public boolean isTerminal(AppointmentStatus status) {
        return TERMINAL_STATUSES.contains(status);
    }

    public void assertTransitionAllowed(AppointmentStatus current, AppointmentStatus target) {
        if (current == target) {
            throw new BusinessRuleException("O agendamento já possui esse status.");
        }

        if (!TRANSITIONS.getOrDefault(current, Set.of()).contains(target)) {
            throw new BusinessRuleException(
                    "Transição de status não permitida: " + current + " para " + target + "."
            );
        }
    }

    public void assertCanCancel(AppointmentStatus status) {
        if (!EnumSet.of(
                AppointmentStatus.PENDING,
                AppointmentStatus.CONFIRMED,
                AppointmentStatus.RESCHEDULED
        ).contains(status)) {
            throw new BusinessRuleException("Este agendamento não pode mais ser cancelado online.");
        }
    }

    public void assertCanReschedule(AppointmentStatus status) {
        if (!EnumSet.of(
                AppointmentStatus.PENDING,
                AppointmentStatus.CONFIRMED,
                AppointmentStatus.RESCHEDULED
        ).contains(status)) {
            throw new BusinessRuleException("Este agendamento não pode mais ser reagendado.");
        }
    }

    public void assertCanHide(AppointmentStatus status) {
        if (!isTerminal(status)) {
            throw new BusinessRuleException(
                    "Só é possível ocultar agendamentos cancelados, faltosos ou concluídos."
            );
        }
    }
}
