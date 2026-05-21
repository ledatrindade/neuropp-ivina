package com.lttech.neuropp.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.lttech.neuropp.dto.AttendanceDocumentResponse;
import com.lttech.neuropp.dto.CreateAttendanceDocumentRequest;
import com.lttech.neuropp.entity.Appointment;
import com.lttech.neuropp.entity.AttendanceDocument;
import com.lttech.neuropp.repository.AppointmentRepository;
import com.lttech.neuropp.repository.AttendanceDocumentRepository;

/*
 * Service responsável pelas regras dos documentos privados.
 *
 * Regras principais:
 * - Ivina cria documento vinculado a um agendamento;
 * - documento nasce privado;
 * - Ivina libera quando desejar;
 * - responsável só acessa documento liberado.
 */
@Service
public class AttendanceDocumentService {

    private final AttendanceDocumentRepository attendanceDocumentRepository;
    private final AppointmentRepository appointmentRepository;

    public AttendanceDocumentService(
            AttendanceDocumentRepository attendanceDocumentRepository,
            AppointmentRepository appointmentRepository
    ) {
        this.attendanceDocumentRepository = attendanceDocumentRepository;
        this.appointmentRepository = appointmentRepository;
    }

    /*
     * Cria documento privado.
     *
     * Ele começa com isReleased = false.
     * Ou seja, ainda não aparece para o responsável.
     */
    @Transactional
    public AttendanceDocumentResponse createDocument(CreateAttendanceDocumentRequest request) {

        Appointment appointment = appointmentRepository.findById(request.getAppointmentId())
                .orElseThrow(() -> new IllegalArgumentException("Agendamento não encontrado."));

        boolean hasContent = request.getContent() != null && !request.getContent().isBlank();
        boolean hasFileUrl = request.getFileUrl() != null && !request.getFileUrl().isBlank();

        /*
         * Regra:
         * o documento precisa ter conteúdo escrito ou arquivo anexado.
         */
        if (!hasContent && !hasFileUrl) {
            throw new IllegalArgumentException("Informe o conteúdo do documento ou um link de arquivo.");
        }

        AttendanceDocument document = AttendanceDocument.builder()
                .appointment(appointment)
                .child(appointment.getChild())
                .responsible(appointment.getResponsible())
                .title(request.getTitle())
                .documentType(request.getDocumentType())
                .content(request.getContent())
                .fileUrl(request.getFileUrl())
                .isReleased(false)
                .build();

        AttendanceDocument savedDocument = attendanceDocumentRepository.save(document);

        return AttendanceDocumentResponse.fromEntity(savedDocument);
    }

    /*
     * Libera documento para o responsável.
     *
     * Depois disso, ele aparece na área privada do responsável.
     */
    @Transactional
    public AttendanceDocumentResponse releaseDocument(UUID documentId) {

        AttendanceDocument document = attendanceDocumentRepository.findById(documentId)
                .orElseThrow(() -> new IllegalArgumentException("Documento não encontrado."));

        if (Boolean.TRUE.equals(document.getIsReleased())) {
            throw new IllegalArgumentException("Este documento já foi liberado para o responsável.");
        }

        document.setIsReleased(true);
        document.setReleasedAt(LocalDateTime.now());

        AttendanceDocument savedDocument = attendanceDocumentRepository.save(document);

        return AttendanceDocumentResponse.fromEntity(savedDocument);
    }

    /*
     * Lista documentos de um agendamento para a admin.
     */
    @Transactional(readOnly = true)
    public List<AttendanceDocumentResponse> listDocumentsByAppointmentForAdmin(UUID appointmentId) {
        return attendanceDocumentRepository.findByAppointmentIdOrderByCreatedAtDesc(appointmentId)
                .stream()
                .map(AttendanceDocumentResponse::fromEntity)
                .toList();
    }

    /*
     * Lista todos os documentos para a admin.
     */
    @Transactional(readOnly = true)
    public List<AttendanceDocumentResponse> listAllDocumentsForAdmin() {
        return attendanceDocumentRepository.findAllByOrderByCreatedAtDesc()
                .stream()
                .map(AttendanceDocumentResponse::fromEntity)
                .toList();
    }

    /*
     * Lista documentos liberados para um responsável.
     */
    @Transactional(readOnly = true)
    public List<AttendanceDocumentResponse> listReleasedDocumentsByResponsible(UUID responsibleId) {
        return attendanceDocumentRepository.findByResponsibleIdAndIsReleasedTrueOrderByCreatedAtDesc(responsibleId)
                .stream()
                .map(AttendanceDocumentResponse::fromEntity)
                .toList();
    }

    /*
     * Busca um documento liberado específico de um responsável.
     *
     * Isso evita acesso indevido por URL.
     */
    @Transactional(readOnly = true)
    public AttendanceDocumentResponse getReleasedDocumentForResponsible(
            UUID responsibleId,
            UUID documentId
    ) {
        AttendanceDocument document = attendanceDocumentRepository
                .findByIdAndResponsibleIdAndIsReleasedTrue(documentId, responsibleId)
                .orElseThrow(() -> new IllegalArgumentException("Documento não encontrado ou ainda não liberado."));

        return AttendanceDocumentResponse.fromEntity(document);
    }
}