package com.votingsystem.dto.election;

import java.time.LocalDateTime;

import com.votingsystem.entity.enums.ElectionStatus;

public record AdminElectionResponse(
        Long id,
        String title,
        String description,
        LocalDateTime startDate,
        LocalDateTime endDate,
        ElectionStatus status,
        long totalCandidates,
        long totalVotes,
        LocalDateTime createdAt) {
}