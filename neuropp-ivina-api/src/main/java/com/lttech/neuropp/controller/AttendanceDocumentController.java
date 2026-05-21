package com.lttech.neuropp.controller;

import java.util.List;
import java.util.UUID;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.lttech.neuropp.dto.AttendanceDocumentResponse;
import com.lttech.neuropp.dto.CreateAttendanceDocumentRequest;
import com.lttech.neuropp.service.AttendanceDocumentService;

import jakarta.validation.Valid;

/*
 * Controller dos documentos privados.
 */
@RestController
@RequestMapping("/api")
public class AttendanceDocumentController {

    private final AttendanceDocumentService attendanceDocumentService;

    public AttendanceDocumentController(AttendanceDocumentService attendanceDocumentService) {
        this.attendanceDocumentService = attendanceDocumentService;
    }

    /*
     * Admin cria documento privado.
     *
     * POST http://localhost:8080/api/admin/documents
     */
    @PostMapping("/admin/documents")
    public AttendanceDocumentResponse createDocument(
            @Valid @RequestBody CreateAttendanceDocumentRequest request
    ) {
        return attendanceDocumentService.createDocument(request);
    }

    /*
     * Admin libera documento para o responsável.
     *
     * PUT http://localhost:8080/api/admin/documents/{documentId}/release
     */
    @PutMapping("/admin/documents/{documentId}/release")
    public AttendanceDocumentResponse releaseDocument(
            @PathVariable UUID documentId
    ) {
        return attendanceDocumentService.releaseDocument(documentId);
    }

    /*
     * Admin lista todos os documentos.
     *
     * GET http://localhost:8080/api/admin/documents
     */
    @GetMapping("/admin/documents")
    public List<AttendanceDocumentResponse> listAllDocumentsForAdmin() {
        return attendanceDocumentService.listAllDocumentsForAdmin();
    }

    /*
     * Admin lista documentos de um agendamento.
     *
     * GET http://localhost:8080/api/admin/appointments/{appointmentId}/documents
     */
    @GetMapping("/admin/appointments/{appointmentId}/documents")
    public List<AttendanceDocumentResponse> listDocumentsByAppointmentForAdmin(
            @PathVariable UUID appointmentId
    ) {
        return attendanceDocumentService.listDocumentsByAppointmentForAdmin(appointmentId);
    }

    /*
     * Responsável lista os documentos liberados para ele.
     *
     * GET http://localhost:8080/api/responsibles/{responsibleId}/documents
     */
    @GetMapping("/responsibles/{responsibleId}/documents")
    public List<AttendanceDocumentResponse> listReleasedDocumentsByResponsible(
            @PathVariable UUID responsibleId
    ) {
        return attendanceDocumentService.listReleasedDocumentsByResponsible(responsibleId);
    }

    /*
     * Responsável visualiza um documento liberado específico.
     *
     * GET http://localhost:8080/api/responsibles/{responsibleId}/documents/{documentId}
     */
    @GetMapping("/responsibles/{responsibleId}/documents/{documentId}")
    public AttendanceDocumentResponse getReleasedDocumentForResponsible(
            @PathVariable UUID responsibleId,
            @PathVariable UUID documentId
    ) {
        return attendanceDocumentService.getReleasedDocumentForResponsible(responsibleId, documentId);
    }
}