package com.lttech.neuropp.controller;

import com.lttech.neuropp.dto.AttendanceDocumentResponse;
import com.lttech.neuropp.dto.CreateAttendanceDocumentRequest;
import com.lttech.neuropp.security.AuthenticatedUserService;
import com.lttech.neuropp.service.AttendanceDocumentService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

/*
 * Controller dos documentos privados.
 */
@RestController
@RequestMapping("/api")
public class AttendanceDocumentController {

    private final AttendanceDocumentService attendanceDocumentService;
    private final AuthenticatedUserService authenticatedUserService;

    public AttendanceDocumentController(
            AttendanceDocumentService attendanceDocumentService,
            AuthenticatedUserService authenticatedUserService
    ) {
        this.attendanceDocumentService = attendanceDocumentService;
        this.authenticatedUserService = authenticatedUserService;
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
     * Responsável logado lista documentos liberados para ele.
     *
     * GET http://localhost:8080/api/documents/my
     */
    @GetMapping("/documents/my")
    public List<AttendanceDocumentResponse> listMyReleasedDocuments() {
        UUID responsibleId = authenticatedUserService.getAuthenticatedUserId();

        return attendanceDocumentService.listReleasedDocumentsByResponsible(responsibleId);
    }

    /*
     * Responsável logado visualiza um documento liberado específico.
     *
     * GET http://localhost:8080/api/documents/my/{documentId}
     */
    @GetMapping("/documents/my/{documentId}")
    public AttendanceDocumentResponse getMyReleasedDocument(
            @PathVariable UUID documentId
    ) {
        UUID responsibleId = authenticatedUserService.getAuthenticatedUserId();

        return attendanceDocumentService.getReleasedDocumentForResponsible(responsibleId, documentId);
    }
}