package com.votingsystem.util;

import org.springframework.stereotype.Component;

import com.votingsystem.dto.election.AdminElectionResponse;
import com.votingsystem.dto.election.ElectionResponse;
import com.votingsystem.entity.Election;
import com.votingsystem.entity.enums.ApplicationStatus;
import com.votingsystem.repository.ElectionCandidateRepository;
import com.votingsystem.repository.VoteRepository;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class ElectionMapper {

    private final ElectionCandidateRepository electionCandidateRepository;
    private final VoteRepository voteRepository;

    public ElectionResponse toResponse(Election election, boolean hasVoted) {
        return new ElectionResponse(
                election.getId(),
                election.getTitle(),
                election.getDescription(),
                election.getStartDate(),
                election.getEndDate(),
                election.getStatus(),
                approvedCandidates(election),
                hasVoted);
    }

    public AdminElectionResponse toAdminResponse(Election election) {
        return new AdminElectionResponse(
                election.getId(),
                election.getTitle(),
                election.getDescription(),
                election.getStartDate(),
                election.getEndDate(),
                election.getStatus(),
                approvedCandidates(election),
                voteRepository.countByElectionId(election.getId()),
                election.getCreatedAt());
    }

    private long approvedCandidates(Election election) {
        return electionCandidateRepository.countByElectionIdAndApplicationStatus(
                election.getId(), ApplicationStatus.APPROVED);
    }
}