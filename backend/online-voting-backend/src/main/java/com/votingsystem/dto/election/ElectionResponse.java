package com.votingsystem.dto.election;

import java.time.LocalDateTime;

import com.votingsystem.entity.enums.ElectionStatus;

public record ElectionResponse(
        Long id,
        String title,
        String description,
        LocalDateTime startDate,
        LocalDateTime endDate,
        ElectionStatus status,
        long totalCandidates,
        boolean hasVoted) {
}