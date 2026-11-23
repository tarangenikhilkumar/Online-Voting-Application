package com.votingsystem.service;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.votingsystem.dto.election.CandidateResultResponse;
import com.votingsystem.dto.election.ElectionResultResponse;
import com.votingsystem.entity.Election;
import com.votingsystem.entity.ElectionCandidate;
import com.votingsystem.entity.enums.ApplicationStatus;
import com.votingsystem.entity.enums.ElectionStatus;
import com.votingsystem.exception.BadRequestException;
import com.votingsystem.exception.ResourceNotFoundException;
import com.votingsystem.repository.ElectionCandidateRepository;
import com.votingsystem.repository.ElectionRepository;
import com.votingsystem.repository.VoteRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ResultService {

    private final ElectionRepository electionRepository;
    private final ElectionCandidateRepository electionCandidateRepository;
    private final VoteRepository voteRepository;

    @Transactional(readOnly = true)
    public ElectionResultResponse getElectionResults(Long electionId, boolean isAdmin) {
        Election election = electionRepository.findById(electionId)
                .orElseThrow(() -> new ResourceNotFoundException("Election not found"));

        if (isAdmin) {
            if (election.getStatus() != ElectionStatus.COMPLETED
                    && election.getStatus() != ElectionStatus.RESULTS_PUBLISHED) {
                throw new BadRequestException("Results are only available after voting ends.");
            }
        } else if (election.getStatus() != ElectionStatus.RESULTS_PUBLISHED) {
            throw new BadRequestException("Results for this election have not been published yet.");
        }

        List<ElectionCandidate> approved = electionCandidateRepository
                .findByElectionIdAndApplicationStatus(electionId, ApplicationStatus.APPROVED);

        Map<Long, Long> voteMap = voteRepository.countVotesByCandidate(electionId).stream()
                .collect(Collectors.toMap(
                        VoteRepository.CandidateVoteCount::getElectionCandidateId,
                        VoteRepository.CandidateVoteCount::getVotes
                ));

        long totalVotes = voteRepository.countByElectionId(electionId);

        List<CandidateResultResponse> sortedTallies = approved.stream()
                .map(ec -> {
                    long votes = voteMap.getOrDefault(ec.getId(), 0L);
                    double pct = totalVotes > 0 ? Math.round((votes * 10000.0) / totalVotes) / 100.0 : 0.0;
                    return new CandidateResultResponse(
                            ec.getId(),
                            ec.getCandidateProfile().getUser().getFullName(),
                            ec.getCandidateProfile().getPartyName(),
                            ec.getCandidateProfile().getProfileImageUrl(),
                            votes,
                            pct,
                            false
                    );
                })
                .sorted(Comparator.comparingLong(CandidateResultResponse::voteCount).reversed())
                .toList();

        long maxVotes = sortedTallies.isEmpty() ? 0 : sortedTallies.get(0).voteCount();
        List<CandidateResultResponse> finalCandidates = new ArrayList<>(sortedTallies.size());

        for (CandidateResultResponse item : sortedTallies) {
            boolean isWinner = maxVotes > 0 && item.voteCount() == maxVotes;
            finalCandidates.add(new CandidateResultResponse(
                    item.electionCandidateId(),
                    item.candidateName(),
                    item.partyName(),
                    item.profileImageUrl(),
                    item.voteCount(),
                    item.votePercentage(),
                    isWinner
            ));
        }

        return new ElectionResultResponse(
                election.getId(),
                election.getTitle(),
                election.getDescription(),
                election.getStatus().name(),
                election.getStartDate(),
                election.getEndDate(),
                totalVotes,
                finalCandidates
        );
    }
}