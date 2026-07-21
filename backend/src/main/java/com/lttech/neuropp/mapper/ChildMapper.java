package com.lttech.neuropp.mapper;

import com.lttech.neuropp.dto.ChildResponse;
import com.lttech.neuropp.entity.Child;
import org.springframework.stereotype.Component;

@Component
public class ChildMapper {

    public ChildResponse toResponse(Child child) {
        return new ChildResponse(
                child.getId(),
                child.getName(),
                child.getAge(),
                child.getResponsible().getId(),
                child.getResponsible().getName()
        );
    }
}
