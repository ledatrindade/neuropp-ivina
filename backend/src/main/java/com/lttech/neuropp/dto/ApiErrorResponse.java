package com.lttech.neuropp.dto;

import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import java.util.Map;

public record ApiErrorResponse(
        int status,
        String error,
        String code,
        String message,
        String path,
        String requestId,
        OffsetDateTime timestamp,
        Map<String, String> fieldErrors
) {
    public static ApiErrorResponse of(
            int status,
            String error,
            String code,
            String message,
            String path,
            String requestId
    ) {
        return new ApiErrorResponse(
                status,
                error,
                code,
                message,
                path,
                requestId,
                OffsetDateTime.now(ZoneOffset.UTC),
                Map.of()
        );
    }

    public static ApiErrorResponse withFieldErrors(
            int status,
            String error,
            String code,
            String message,
            String path,
            String requestId,
            Map<String, String> fieldErrors
    ) {
        return new ApiErrorResponse(
                status,
                error,
                code,
                message,
                path,
                requestId,
                OffsetDateTime.now(ZoneOffset.UTC),
                Map.copyOf(fieldErrors)
        );
    }
}
