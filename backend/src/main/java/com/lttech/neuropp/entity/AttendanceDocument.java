package com.lttech.neuropp.entity;

import com.lttech.neuropp.enums.DocumentType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.Version;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "attendance_documents")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AttendanceDocument extends AuditableEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "appointment_id", nullable = false)
    private Appointment appointment;

    @Column(nullable = false, length = 180)
    private String title;

    @Enumerated(EnumType.STRING)
    @Column(name = "document_type", nullable = false, length = 40)
    private DocumentType documentType;

    @Column(columnDefinition = "TEXT")
    private String content;

    @Column(name = "file_url", length = 2048)
    private String fileUrl;

    @Builder.Default
    @Column(name = "is_released", nullable = false)
    private Boolean isReleased = false;

    @Column(name = "released_at")
    private Instant releasedAt;

    @Version
    @Column(nullable = false)
    private Long version;
}
