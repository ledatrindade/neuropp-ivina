package com.lttech.neuropp.repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.lttech.neuropp.entity.AttendanceDocument;

/*
 * Repository dos documentos privados de avaliação/sessão.
 */
public interface AttendanceDocumentRepository extends JpaRepository<AttendanceDocument, UUID> {

    /*
     * Lista todos os documentos de um agendamento.
     */
    List<AttendanceDocument> findByAppointmentIdOrderByCreatedAtDesc(UUID appointmentId);

    /*
     * Lista todos os documentos liberados para um responsável.
     */
    List<AttendanceDocument> findByResponsibleIdAndIsReleasedTrueOrderByCreatedAtDesc(UUID responsibleId);

    /*
     * Busca um documento específico liberado para um responsável.
     */
    Optional<AttendanceDocument> findByIdAndResponsibleIdAndIsReleasedTrue(
            UUID documentId,
            UUID responsibleId
    );

    /*
     * Lista todos os documentos para o painel admin.
     */
    List<AttendanceDocument> findAllByOrderByCreatedAtDesc();

    /*
     * Remove documentos vinculados a um agendamento.
     *
     * Usado antes de remover um agendamento cancelado, evitando erro de FK.
     */
    void deleteByAppointmentId(UUID appointmentId);
}