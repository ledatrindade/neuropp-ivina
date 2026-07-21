package com.lttech.neuropp.service;

import com.lttech.neuropp.dto.AttendanceDocumentDetailResponse;
import com.lttech.neuropp.dto.AttendanceDocumentSummaryResponse;
import com.lttech.neuropp.dto.CreateAttendanceDocumentRequest;
import com.lttech.neuropp.dto.PageResponse;
import com.lttech.neuropp.entity.Appointment;
import com.lttech.neuropp.entity.AttendanceDocument;
import com.lttech.neuropp.enums.AppointmentStatus;
import com.lttech.neuropp.exception.BusinessRuleException;
import com.lttech.neuropp.exception.ResourceNotFoundException;
import com.lttech.neuropp.mapper.AttendanceDocumentMapper;
import com.lttech.neuropp.repository.AppointmentRepository;
import com.lttech.neuropp.repository.AttendanceDocumentRepository;
import com.lttech.neuropp.util.InputNormalizer;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.net.URI;
import java.time.Clock;
import java.time.Instant;
import java.util.EnumSet;
import java.util.List;
import java.util.UUID;

@Service
public class AttendanceDocumentService {

    private static final EnumSet<AppointmentStatus> DOCUMENT_ALLOWED_STATUSES = EnumSet.of(
            AppointmentStatus.CONFIRMED,
            AppointmentStatus.ATTENDED,
            AppointmentStatus.COMPLETED
    );

    private final AttendanceDocumentRepository documentRepository;
    private final AppointmentRepository appointmentRepository;
    private final AttendanceDocumentMapper documentMapper;
    private final Clock clock;

    public AttendanceDocumentService(
            AttendanceDocumentRepository documentRepository,
            AppointmentRepository appointmentRepository,
            AttendanceDocumentMapper documentMapper,
            Clock clock
    ) {
        this.documentRepository = documentRepository;
        this.appointmentRepository = appointmentRepository;
        this.documentMapper = documentMapper;
        this.clock = clock;
    }

    @Transactional
    public AttendanceDocumentDetailResponse createDocument(CreateAttendanceDocumentRequest request) {
        Appointment appointment = appointmentRepository.findDetailedById(request.appointmentId())
                .orElseThrow(() -> new ResourceNotFoundException("Agendamento não encontrado."));

        if (!DOCUMENT_ALLOWED_STATUSES.contains(appointment.getStatus())) {
            throw new BusinessRuleException(
                    "Documentos só podem ser criados para atendimentos confirmados, realizados ou concluídos."
            );
        }

        String content = InputNormalizer.optionalText(request.content());
        String fileUrl = validateAndNormalizeFileUrl(request.fileUrl());

        if (content == null && fileUrl == null) {
            throw new BusinessRuleException("Informe o conteúdo do documento ou um link HTTPS de arquivo.");
        }

        AttendanceDocument document = AttendanceDocument.builder()
                .appointment(appointment)
                .title(InputNormalizer.requiredText(request.title()))
                .documentType(request.documentType())
                .content(content)
                .fileUrl(fileUrl)
                .isReleased(false)
                .build();

        return documentMapper.toDetail(documentRepository.save(document));
    }

    @Transactional
    public AttendanceDocumentDetailResponse releaseDocument(UUID documentId) {
        AttendanceDocument document = documentRepository.findDetailedById(documentId)
                .orElseThrow(() -> new ResourceNotFoundException("Documento não encontrado."));

        if (Boolean.TRUE.equals(document.getIsReleased())) {
            throw new BusinessRuleException("Este documento já foi liberado.");
        }

        document.setIsReleased(true);
        document.setReleasedAt(Instant.now(clock));
        return documentMapper.toDetail(documentRepository.save(document));
    }

    @Transactional(readOnly = true)
    public PageResponse<AttendanceDocumentSummaryResponse> listAllDocumentsForAdmin(Pageable pageable) {
        Page<AttendanceDocumentSummaryResponse> page = documentRepository
                .findAllByOrderByCreatedAtDesc(pageable)
                .map(documentMapper::toSummary);
        return PageResponse.from(page);
    }

    @Transactional(readOnly = true)
    public List<AttendanceDocumentSummaryResponse> listDocumentsByAppointmentForAdmin(
            UUID appointmentId
    ) {
        if (!appointmentRepository.existsById(appointmentId)) {
            throw new ResourceNotFoundException("Agendamento não encontrado.");
        }

        return documentRepository.findByAppointmentIdOrderByCreatedAtDesc(appointmentId)
                .stream()
                .map(documentMapper::toSummary)
                .toList();
    }

    @Transactional(readOnly = true)
    public AttendanceDocumentDetailResponse getDocumentForAdmin(UUID documentId) {
        AttendanceDocument document = documentRepository.findDetailedById(documentId)
                .orElseThrow(() -> new ResourceNotFoundException("Documento não encontrado."));
        return documentMapper.toDetail(document);
    }

    @Transactional(readOnly = true)
    public PageResponse<AttendanceDocumentSummaryResponse> listReleasedDocumentsByResponsible(
            UUID responsibleId,
            Pageable pageable
    ) {
        Page<AttendanceDocumentSummaryResponse> page = documentRepository
                .findByAppointmentResponsibleIdAndIsReleasedTrueOrderByCreatedAtDesc(
                        responsibleId,
                        pageable
                )
                .map(documentMapper::toSummary);
        return PageResponse.from(page);
    }

    @Transactional(readOnly = true)
    public AttendanceDocumentDetailResponse getReleasedDocumentForResponsible(
            UUID responsibleId,
            UUID documentId
    ) {
        AttendanceDocument document = documentRepository
                .findByIdAndAppointmentResponsibleIdAndIsReleasedTrue(documentId, responsibleId)
                .orElseThrow(() -> new ResourceNotFoundException("Documento não encontrado."));

        return documentMapper.toDetail(document);
    }

    private String validateAndNormalizeFileUrl(String value) {
        String normalized = InputNormalizer.optionalText(value);
        if (normalized == null) {
            return null;
        }

        try {
            URI uri = URI.create(normalized);
            if (!"https".equalsIgnoreCase(uri.getScheme())
                    || uri.getHost() == null
                    || uri.getUserInfo() != null) {
                throw new IllegalArgumentException();
            }
            return uri.toASCIIString();
        } catch (IllegalArgumentException exception) {
            throw new BusinessRuleException("O arquivo deve usar uma URL HTTPS válida.");
        }
    }
}
