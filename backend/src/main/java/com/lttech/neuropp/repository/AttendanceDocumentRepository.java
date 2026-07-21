package com.lttech.neuropp.repository;

import com.lttech.neuropp.entity.AttendanceDocument;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface AttendanceDocumentRepository extends JpaRepository<AttendanceDocument, UUID> {

    @EntityGraph(attributePaths = {
            "appointment",
            "appointment.responsible",
            "appointment.child"
    })
    List<AttendanceDocument> findByAppointmentIdOrderByCreatedAtDesc(UUID appointmentId);

    @EntityGraph(attributePaths = {
            "appointment",
            "appointment.responsible",
            "appointment.child"
    })
    Page<AttendanceDocument> findByAppointmentResponsibleIdAndIsReleasedTrueOrderByCreatedAtDesc(
            UUID responsibleId,
            Pageable pageable
    );

    @EntityGraph(attributePaths = {
            "appointment",
            "appointment.responsible",
            "appointment.child"
    })
    Optional<AttendanceDocument> findByIdAndAppointmentResponsibleIdAndIsReleasedTrue(
            UUID documentId,
            UUID responsibleId
    );

    @EntityGraph(attributePaths = {
            "appointment",
            "appointment.responsible",
            "appointment.child"
    })
    Page<AttendanceDocument> findAllByOrderByCreatedAtDesc(Pageable pageable);

    @EntityGraph(attributePaths = {
            "appointment",
            "appointment.responsible",
            "appointment.child"
    })
    Optional<AttendanceDocument> findDetailedById(UUID documentId);
}
