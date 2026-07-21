package com.lttech.neuropp.service;

import com.lttech.neuropp.exception.BusinessRuleException;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;
import static org.junit.jupiter.api.Assertions.assertThrows;

class PasswordPolicyTest {

    private final PasswordPolicy policy = new PasswordPolicy();

    @Test
    void shouldAcceptLongNonPredictablePassword() {
        assertDoesNotThrow(() -> policy.validate(
                "Cacto-Lua-27-Ponte!",
                "pessoa@example.com"
        ));
    }

    @Test
    void shouldRejectNumericOnlyPassword() {
        assertThrows(BusinessRuleException.class, () -> policy.validate(
                "9876543210987654",
                "pessoa@example.com"
        ));
    }

    @Test
    void shouldRejectEmailLocalPartInsidePassword() {
        assertThrows(BusinessRuleException.class, () -> policy.validate(
                "pessoa-uma-senha-forte",
                "pessoa@example.com"
        ));
    }
    @Test
    void shouldRejectPasswordAboveBcryptByteLimit() {
        String password = "á".repeat(40);

        assertThrows(BusinessRuleException.class, () -> policy.validate(
                password,
                "pessoa@example.com"
        ));
    }

}
