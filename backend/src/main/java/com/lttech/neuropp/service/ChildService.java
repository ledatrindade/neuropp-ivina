package com.lttech.neuropp.service;

import com.lttech.neuropp.dto.ChildResponse;
import com.lttech.neuropp.dto.CreateMyChildRequest;
import com.lttech.neuropp.entity.Child;
import com.lttech.neuropp.entity.User;
import com.lttech.neuropp.enums.UserRole;
import com.lttech.neuropp.exception.ForbiddenOperationException;
import com.lttech.neuropp.exception.ResourceNotFoundException;
import com.lttech.neuropp.mapper.ChildMapper;
import com.lttech.neuropp.repository.ChildRepository;
import com.lttech.neuropp.repository.UserRepository;
import com.lttech.neuropp.util.InputNormalizer;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
public class ChildService {

    private final ChildRepository childRepository;
    private final UserRepository userRepository;
    private final ChildMapper childMapper;

    public ChildService(
            ChildRepository childRepository,
            UserRepository userRepository,
            ChildMapper childMapper
    ) {
        this.childRepository = childRepository;
        this.userRepository = userRepository;
        this.childMapper = childMapper;
    }

    @Transactional
    public ChildResponse createChildForResponsible(UUID responsibleId, CreateMyChildRequest request) {
        User responsible = findActiveResponsible(responsibleId);

        Child child = Child.builder()
                .name(InputNormalizer.requiredText(request.name()))
                .age(request.age())
                .responsible(responsible)
                .build();

        return childMapper.toResponse(childRepository.save(child));
    }

    @Transactional(readOnly = true)
    public List<ChildResponse> listChildrenByResponsible(UUID responsibleId) {
        findActiveResponsible(responsibleId);

        return childRepository.findByResponsibleIdOrderByNameAsc(responsibleId)
                .stream()
                .map(childMapper::toResponse)
                .toList();
    }

    private User findActiveResponsible(UUID responsibleId) {
        User user = userRepository.findById(responsibleId)
                .orElseThrow(() -> new ResourceNotFoundException("Responsável não encontrado."));

        if (!Boolean.TRUE.equals(user.getActive()) || user.getRole() != UserRole.RESPONSIBLE) {
            throw new ForbiddenOperationException("A conta não está autorizada a realizar esta operação.");
        }

        return user;
    }
}
