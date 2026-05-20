package com.lttech.neuropp.repository;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.lttech.neuropp.entity.Child;

/*
 * Repository da tabela children.
 */
public interface ChildRepository extends JpaRepository<Child, UUID> {

    /*
     * Busca todas as crianças vinculadas a um responsável.
     */
    List<Child> findByResponsibleId(UUID responsibleId);
}