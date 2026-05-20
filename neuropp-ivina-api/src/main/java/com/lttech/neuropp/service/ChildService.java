package com.lttech.neuropp.service;

import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;

import com.lttech.neuropp.dto.ChildResponse;
import com.lttech.neuropp.dto.CreateChildRequest;
import com.lttech.neuropp.entity.Child;
import com.lttech.neuropp.entity.User;
import com.lttech.neuropp.repository.ChildRepository;
import com.lttech.neuropp.repository.UserRepository;

/*
 * Service responsável pelas regras da criança.
 */
@Service
public class ChildService {

    private final ChildRepository childRepository;
    private final UserRepository userRepository;

    public ChildService(ChildRepository childRepository, UserRepository userRepository) {
        this.childRepository = childRepository;
        this.userRepository = userRepository;
    }

    public ChildResponse createChild(CreateChildRequest request) {

        User responsible = userRepository.findById(request.getResponsibleId())
                .orElseThrow(() -> new IllegalArgumentException("Responsável não encontrado."));

        Child child = Child.builder()
                .name(request.getName())
                .age(request.getAge())
                .responsible(responsible)
                .build();

        Child savedChild = childRepository.save(child);

        return ChildResponse.fromEntity(savedChild);
    }

    public List<ChildResponse> listChildrenByResponsible(UUID responsibleId) {
        return childRepository.findByResponsibleId(responsibleId)
                .stream()
                .map(ChildResponse::fromEntity)
                .toList();
    }
}