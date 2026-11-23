package com.votingsystem.dto.election;

public record CandidateResultResponse(
        Long electionCandidateId,
        String candidateName,
        String partyName,
        String profileImageUrl,
        long voteCount,
        double votePercentage,
        boolean winner
) {
}