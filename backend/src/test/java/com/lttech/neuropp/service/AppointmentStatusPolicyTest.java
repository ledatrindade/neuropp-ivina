package com.lttech.neuropp.service;

import com.lttech.neuropp.enums.AppointmentStatus;
import com.lttech.neuropp.exception.BusinessRuleException;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;
import static org.junit.jupiter.api.Assertions.assertThrows;

class AppointmentStatusPolicyTest {

    private final AppointmentStatusPolicy policy = new AppointmentStatusPolicy();

    @Test
    void shouldAllowExpectedTransition() {
        assertDoesNotThrow(() -> policy.assertTransitionAllowed(
                AppointmentStatus.PENDING,
                AppointmentStatus.CONFIRMED
        ));
    }

    @Test
    void shouldRejectCompletedBackToPending() {
        assertThrows(BusinessRuleException.class, () -> policy.assertTransitionAllowed(
                AppointmentStatus.COMPLETED,
                AppointmentStatus.PENDING
        ));
    }

    @Test
    void shouldOnlyHideTerminalAppointments() {
        assertDoesNotThrow(() -> policy.assertCanHide(AppointmentStatus.CANCELLED));
        assertThrows(
                BusinessRuleException.class,
                () -> policy.assertCanHide(AppointmentStatus.CONFIRMED)
        );
    }
}
