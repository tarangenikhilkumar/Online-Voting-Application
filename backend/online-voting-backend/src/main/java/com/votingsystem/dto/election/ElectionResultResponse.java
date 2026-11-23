package com.votingsystem.dto.election;

import java.time.LocalDateTime;
import java.util.List;

public record ElectionResultResponse(
        Long electionId,
        String electionTitle,
        String description,
        String status,
        LocalDateTime startDate,
        LocalDateTime endDate,
        long totalVotes,
        List<CandidateResultResponse> candidates
) {
}