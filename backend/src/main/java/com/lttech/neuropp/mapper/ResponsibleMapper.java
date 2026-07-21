package com.lttech.neuropp.mapper;

import com.lttech.neuropp.dto.ResponsibleResponse;
import com.lttech.neuropp.entity.User;
import org.springframework.stereotype.Component;

@Component
public class ResponsibleMapper {

    public ResponsibleResponse toResponse(User user) {
        return new ResponsibleResponse(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getPhone(),
                user.getRole()
        );
    }
}
