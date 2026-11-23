package com.votingsystem.dto.candidate;

import com.votingsystem.entity.CandidateProfile;
import com.votingsystem.entity.ElectionCandidate;

public record BallotCandidateResponse(
        Long electionCandidateId,
        String name,
        String partyName,
        String description,
        String profileImageUrl) {

    public static BallotCandidateResponse from(ElectionCandidate ec) {
        CandidateProfile profile = ec.getCandidateProfile();

        return new BallotCandidateResponse(
                ec.getId(),
                profile.getUser().getFullName(),
                profile.getPartyName(),
                profile.getDescription(),
                profile.getProfileImageUrl());
    }
}