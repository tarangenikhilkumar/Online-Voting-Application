package com.votingsystem.dto.candidate;

import java.time.LocalDateTime;

import com.votingsystem.entity.CandidateProfile;
import com.votingsystem.entity.Election;
import com.votingsystem.entity.ElectionCandidate;
import com.votingsystem.entity.enums.ApplicationStatus;
import com.votingsystem.entity.enums.ElectionStatus;

public record ApplicationResponse(
        Long id,
        Long electionId,
        String electionTitle,
        ElectionStatus electionStatus,
        Long candidateProfileId,
        String candidateName,
        String partyName,
        String profileImageUrl,
        ApplicationStatus status,
        LocalDateTime appliedAt,
        LocalDateTime reviewedAt) {

    public static ApplicationResponse from(ElectionCandidate ec) {
        Election election = ec.getElection();
        CandidateProfile profile = ec.getCandidateProfile();

        return new ApplicationResponse(
                ec.getId(),
                election.getId(),
                election.getTitle(),
                election.getStatus(),
                profile.getId(),
                profile.getUser().getFullName(),
                profile.getPartyName(),
                profile.getProfileImageUrl(),
                ec.getApplicationStatus(),
                ec.getAppliedAt(),
                ec.getReviewedAt());
    }
}