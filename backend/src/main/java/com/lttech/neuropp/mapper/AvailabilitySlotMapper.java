package com.lttech.neuropp.mapper;

import com.lttech.neuropp.dto.AvailabilitySlotResponse;
import com.lttech.neuropp.entity.AvailabilitySlot;
import org.springframework.stereotype.Component;

@Component
public class AvailabilitySlotMapper {

    public AvailabilitySlotResponse toResponse(AvailabilitySlot slot) {
        return new AvailabilitySlotResponse(
                slot.getId(),
                slot.getDate(),
                slot.getStartTime(),
                slot.getEndTime(),
                slot.getIsAvailable(),
                slot.getIsBlocked()
        );
    }
}
