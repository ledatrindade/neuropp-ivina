package com.lttech.neuropp.repository;

import com.lttech.neuropp.entity.Appointment;
import com.lttech.neuropp.enums.AppointmentStatus;
import jakarta.persistence.LockModeType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Collection;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface AppointmentRepository extends JpaRepository<Appointment, UUID> {

    @EntityGraph(attributePaths = {"responsible", "child", "slot"})
    Page<Appointment> findByResponsibleIdAndHiddenForResponsibleFalseOrderByCreatedAtDesc(
            UUID responsibleId,
            Pageable pageable
    );

    @EntityGraph(attributePaths = {"responsible", "child", "slot"})
    Page<Appointment> findByHiddenForAdminFalseOrderByCreatedAtDesc(Pageable pageable);

    @EntityGraph(attributePaths = {"responsible", "child", "slot"})
    Optional<Appointment> findDetailedById(UUID id);

    @EntityGraph(attributePaths = {"responsible", "child", "slot"})
    Optional<Appointment> findByIdAndResponsibleId(UUID id, UUID responsibleId);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("""
            select a from Appointment a
            join fetch a.responsible
            join fetch a.child
            join fetch a.slot
            where a.id = :id
            """)
    Optional<Appointment> findByIdForUpdate(@Param("id") UUID id);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("""
            select a from Appointment a
            join fetch a.responsible
            join fetch a.child
            join fetch a.slot
            where a.id = :id and a.responsible.id = :responsibleId
            """)
    Optional<Appointment> findByIdAndResponsibleIdForUpdate(
            @Param("id") UUID id,
            @Param("responsibleId") UUID responsibleId
    );

    boolean existsBySlotIdAndStatusIn(UUID slotId, Collection<AppointmentStatus> statuses);

    List<Appointment> findBySlotId(UUID slotId);
}
