package com.lttech.neuropp.entity;

import com.lttech.neuropp.enums.AppointmentStatus;
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
@Table(name = "appointments")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Appointment extends AuditableEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "responsible_id", nullable = false)
    private User responsible;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "child_id", nullable = false)
    private Child child;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "slot_id", nullable = false)
    private AvailabilitySlot slot;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private AppointmentStatus status;

    @Column(columnDefinition = "TEXT")
    private String notes;

    @Builder.Default
    @Column(name = "hidden_for_responsible", nullable = false)
    private Boolean hiddenForResponsible = false;

    @Builder.Default
    @Column(name = "hidden_for_admin", nullable = false)
    private Boolean hiddenForAdmin = false;

    @Column(name = "cancelled_at")
    private Instant cancelledAt;

    @Column(name = "rescheduled_at")
    private Instant rescheduledAt;

    @Column(name = "completed_at")
    private Instant completedAt;

    @Version
    @Column(nullable = false)
    private Long version;
}
