package com.lttech.neuropp.repository;

import com.lttech.neuropp.entity.AvailabilitySlot;
import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface AvailabilitySlotRepository extends JpaRepository<AvailabilitySlot, UUID> {

    List<AvailabilitySlot> findByDateAndIsAvailableTrueAndIsBlockedFalseAndDeletedAtIsNullOrderByStartTimeAsc(
            LocalDate date
    );

    List<AvailabilitySlot> findByDateAndDeletedAtIsNullOrderByStartTimeAsc(LocalDate date);

    Optional<AvailabilitySlot> findByIdAndDeletedAtIsNull(UUID id);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("select s from AvailabilitySlot s where s.id = :id and s.deletedAt is null")
    Optional<AvailabilitySlot> findByIdForUpdate(@Param("id") UUID id);

    @Query("""
            select (count(s) > 0)
            from AvailabilitySlot s
            where s.date = :date
              and s.deletedAt is null
              and s.startTime < :endTime
              and s.endTime > :startTime
            """)
    boolean existsOverlapping(
            @Param("date") LocalDate date,
            @Param("startTime") LocalTime startTime,
            @Param("endTime") LocalTime endTime
    );

    @Query("""
            select (count(s) > 0)
            from AvailabilitySlot s
            where s.date = :date
              and s.deletedAt is null
              and s.id <> :ignoredId
              and s.startTime < :endTime
              and s.endTime > :startTime
            """)
    boolean existsOverlappingExcludingId(
            @Param("date") LocalDate date,
            @Param("startTime") LocalTime startTime,
            @Param("endTime") LocalTime endTime,
            @Param("ignoredId") UUID ignoredId
    );
}
