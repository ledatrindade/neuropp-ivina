package com.lttech.neuropp.repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.lttech.neuropp.entity.AttendanceDocument;

/*
 * Repository dos documentos privados de avaliação/sessão.
 *
 * Ele conversa com a tabela attendance_documents.
 */
public interface AttendanceDocumentRepository extends JpaRepository<AttendanceDocument, UUID> {

    /*
     * Lista todos os documentos de um agendamento.
     * Usado pela administradora Ivina.
     */
    List<AttendanceDocument> findByAppointmentIdOrderByCreatedAtDesc(UUID appointmentId);

    /*
     * Lista todos os documentos liberados para um responsável.
     * Usado na área do responsável.
     */
    List<AttendanceDocument> findByResponsibleIdAndIsReleasedTrueOrderByCreatedAtDesc(UUID responsibleId);

    /*
     * Busca um documento específico liberado para um responsável.
     * Isso evita que um responsável acesse documento de outra pessoa.
     */
    Optional<AttendanceDocument> findByIdAndResponsibleIdAndIsReleasedTrue(
            UUID documentId,
            UUID responsibleId
    );

    /*
     * Lista todos os documentos para o painel admin.
     */
    List<AttendanceDocument> findAllByOrderByCreatedAtDesc();
}