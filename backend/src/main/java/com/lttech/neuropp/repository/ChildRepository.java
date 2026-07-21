package com.lttech.neuropp.repository;

import com.lttech.neuropp.entity.Child;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface ChildRepository extends JpaRepository<Child, UUID> {

    @EntityGraph(attributePaths = "responsible")
    List<Child> findByResponsibleIdOrderByNameAsc(UUID responsibleId);

    @EntityGraph(attributePaths = "responsible")
    Optional<Child> findByIdAndResponsibleId(UUID childId, UUID responsibleId);
}
