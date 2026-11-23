package com.votingsystem.dto.vote;

import java.time.LocalDateTime;

import com.votingsystem.entity.Election;
import com.votingsystem.entity.VoterParticipation;
import com.votingsystem.entity.enums.ElectionStatus;

public record VotingHistoryResponse(
        Long electionId,
        String electionTitle,
        ElectionStatus electionStatus,
        LocalDateTime votedAt) {

    public static VotingHistoryResponse from(VoterParticipation participation) {
        Election election = participation.getElection();

        return new VotingHistoryResponse(
                election.getId(),
                election.getTitle(),
                election.getStatus(),
                participation.getVotedAt());
    }
}