package com.lttech.neuropp.util;

import java.util.Locale;

public final class InputNormalizer {

    private InputNormalizer() {
    }

    public static String requiredText(String value) {
        return value == null ? null : value.strip();
    }

    public static String optionalText(String value) {
        if (value == null || value.isBlank()) {
            return null;
        }
        return value.strip();
    }

    public static String email(String value) {
        return requiredText(value).toLowerCase(Locale.ROOT);
    }

    public static String phone(String value) {
        return requiredText(value).replaceAll("[\\s().-]", "");
    }
}
