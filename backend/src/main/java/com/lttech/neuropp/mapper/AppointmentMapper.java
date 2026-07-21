package com.lttech.neuropp.mapper;

import com.lttech.neuropp.dto.AppointmentResponse;
import com.lttech.neuropp.entity.Appointment;
import org.springframework.stereotype.Component;

@Component
public class AppointmentMapper {

    public AppointmentResponse toResponse(Appointment appointment) {
        return new AppointmentResponse(
                appointment.getId(),
                appointment.getResponsible().getId(),
                appointment.getResponsible().getName(),
                appointment.getResponsible().getPhone(),
                appointment.getChild().getId(),
                appointment.getChild().getName(),
                appointment.getChild().getAge(),
                appointment.getSlot().getId(),
                appointment.getSlot().getDate(),
                appointment.getSlot().getStartTime(),
                appointment.getSlot().getEndTime(),
                appointment.getStatus(),
                appointment.getNotes(),
                appointment.getCreatedAt(),
                appointment.getUpdatedAt()
        );
    }
}
