package com.lttech.neuropp.mapper;

import com.lttech.neuropp.dto.AttendanceDocumentDetailResponse;
import com.lttech.neuropp.dto.AttendanceDocumentSummaryResponse;
import com.lttech.neuropp.entity.Appointment;
import com.lttech.neuropp.entity.AttendanceDocument;
import org.springframework.stereotype.Component;

@Component
public class AttendanceDocumentMapper {

    public AttendanceDocumentSummaryResponse toSummary(AttendanceDocument document) {
        Appointment appointment = document.getAppointment();

        return new AttendanceDocumentSummaryResponse(
                document.getId(),
                appointment.getId(),
                appointment.getResponsible().getId(),
                appointment.getResponsible().getName(),
                appointment.getChild().getId(),
                appointment.getChild().getName(),
                document.getTitle(),
                document.getDocumentType(),
                document.getIsReleased(),
                document.getReleasedAt(),
                document.getCreatedAt()
        );
    }

    public AttendanceDocumentDetailResponse toDetail(AttendanceDocument document) {
        Appointment appointment = document.getAppointment();

        return new AttendanceDocumentDetailResponse(
                document.getId(),
                appointment.getId(),
                appointment.getResponsible().getId(),
                appointment.getResponsible().getName(),
                appointment.getChild().getId(),
                appointment.getChild().getName(),
                document.getTitle(),
                document.getDocumentType(),
                document.getContent(),
                document.getFileUrl(),
                document.getIsReleased(),
                document.getReleasedAt(),
                document.getCreatedAt(),
                document.getUpdatedAt()
        );
    }
}
