package com.votingsystem.service.impl;

import java.time.LocalDateTime;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.votingsystem.dto.common.PageResponse;
import com.votingsystem.dto.vote.VoteReceiptResponse;
import com.votingsystem.dto.vote.VotingHistoryResponse;
import com.votingsystem.entity.Election;
import com.votingsystem.entity.ElectionCandidate;
import com.votingsystem.entity.Vote;
import com.votingsystem.entity.VoterParticipation;
import com.votingsystem.entity.enums.ApplicationStatus;
import com.votingsystem.entity.enums.ElectionStatus;
import com.votingsystem.exception.BadRequestException;
import com.votingsystem.exception.DuplicateVoteException;
import com.votingsystem.exception.ElectionNotActiveException;
import com.votingsystem.exception.ResourceNotFoundException;
import com.votingsystem.repository.ElectionCandidateRepository;
import com.votingsystem.repository.ElectionRepository;
import com.votingsystem.repository.UserRepository;
import com.votingsystem.repository.VoteRepository;
import com.votingsystem.repository.VoterParticipationRepository;
import com.votingsystem.service.AuditLogService;
import com.votingsystem.service.VoteService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class VoteServiceImpl implements VoteService {

    private final ElectionRepository electionRepository;
    private final ElectionCandidateRepository electionCandidateRepository;
    private final VoterParticipationRepository participationRepository;
    private final VoteRepository voteRepository;
    private final UserRepository userRepository;
    private final AuditLogService auditLogService;

    @Override
    @Transactional
    public VoteReceiptResponse castVote(Long userId, Long electionId, Long electionCandidateId) {
        Election election = electionRepository.findById(electionId)
                .orElseThrow(() -> new ResourceNotFoundException("Election", electionId));

        LocalDateTime now = LocalDateTime.now();
        boolean votingOpen = election.getStatus() == ElectionStatus.ACTIVE
                && !now.isBefore(election.getStartDate())
                && now.isBefore(election.getEndDate());
        if (!votingOpen) {
            throw new ElectionNotActiveException("Voting is not open for this election");
        }

        ElectionCandidate candidate = electionCandidateRepository
                .findByIdAndElectionId(electionCandidateId, electionId)
                .filter(ec -> ec.getApplicationStatus() == ApplicationStatus.APPROVED)
                .orElseThrow(() -> new BadRequestException("Selected candidate is not valid for this election"));

        if (participationRepository.existsByElectionIdAndUserId(electionId, userId)) {
            throw new DuplicateVoteException();
        }

        VoterParticipation participation;
        try {
            participation = participationRepository.saveAndFlush(VoterParticipation.builder()
                    .election(election)
                    .user(userRepository.getReferenceById(userId))
                    .build());
        } catch (DataIntegrityViolationException ex) {
            throw new DuplicateVoteException();
        }

        voteRepository.save(Vote.builder()
                .electionId(electionId)
                .electionCandidateId(candidate.getId())
                .build());

        auditLogService.log(userId, "VOTE_CAST", "Election: " + election.getTitle());

        return new VoteReceiptResponse(election.getId(), election.getTitle(), participation.getVotedAt());
    }

    @Override
    @Transactional(readOnly = true)
    public PageResponse<VotingHistoryResponse> getVotingHistory(Long userId, Pageable pageable) {
        return PageResponse.from(
                participationRepository.findByUserId(userId, pageable),
                VotingHistoryResponse::from);
    }
}