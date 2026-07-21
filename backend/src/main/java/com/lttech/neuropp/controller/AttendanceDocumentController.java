package com.lttech.neuropp.controller;

import com.lttech.neuropp.dto.AttendanceDocumentDetailResponse;
import com.lttech.neuropp.dto.AttendanceDocumentSummaryResponse;
import com.lttech.neuropp.dto.CreateAttendanceDocumentRequest;
import com.lttech.neuropp.dto.PageResponse;
import com.lttech.neuropp.security.AuthenticatedUserService;
import com.lttech.neuropp.service.AttendanceDocumentService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

@Validated
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

    @PostMapping("/admin/documents")
    @ResponseStatus(HttpStatus.CREATED)
    public AttendanceDocumentDetailResponse createDocument(
            @Valid @RequestBody CreateAttendanceDocumentRequest request
    ) {
        return attendanceDocumentService.createDocument(request);
    }

    @PutMapping("/admin/documents/{documentId}/release")
    public AttendanceDocumentDetailResponse releaseDocument(@PathVariable UUID documentId) {
        return attendanceDocumentService.releaseDocument(documentId);
    }

    @GetMapping("/admin/documents")
    public PageResponse<AttendanceDocumentSummaryResponse> listAllDocumentsForAdmin(
            @RequestParam(defaultValue = "0") @Min(0) int page,
            @RequestParam(defaultValue = "20") @Min(1) @Max(100) int size
    ) {
        return attendanceDocumentService.listAllDocumentsForAdmin(PageRequest.of(page, size));
    }

    @GetMapping("/admin/documents/{documentId}")
    public AttendanceDocumentDetailResponse getDocumentForAdmin(
            @PathVariable UUID documentId
    ) {
        return attendanceDocumentService.getDocumentForAdmin(documentId);
    }

    @GetMapping("/admin/appointments/{appointmentId}/documents")
    public List<AttendanceDocumentSummaryResponse> listDocumentsByAppointmentForAdmin(
            @PathVariable UUID appointmentId
    ) {
        return attendanceDocumentService.listDocumentsByAppointmentForAdmin(appointmentId);
    }

    @GetMapping("/documents/my")
    public PageResponse<AttendanceDocumentSummaryResponse> listMyReleasedDocuments(
            @RequestParam(defaultValue = "0") @Min(0) int page,
            @RequestParam(defaultValue = "20") @Min(1) @Max(100) int size
    ) {
        UUID responsibleId = authenticatedUserService.getAuthenticatedUserId();
        return attendanceDocumentService.listReleasedDocumentsByResponsible(
                responsibleId,
                PageRequest.of(page, size)
        );
    }

    @GetMapping("/documents/my/{documentId}")
    public AttendanceDocumentDetailResponse getMyReleasedDocument(
            @PathVariable UUID documentId
    ) {
        UUID responsibleId = authenticatedUserService.getAuthenticatedUserId();
        return attendanceDocumentService.getReleasedDocumentForResponsible(
                responsibleId,
                documentId
        );
    }
}
