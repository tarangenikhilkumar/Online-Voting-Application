package com.votingsystem.service;

import org.springframework.data.domain.Pageable;

import com.votingsystem.dto.common.PageResponse;
import com.votingsystem.dto.vote.VoteReceiptResponse;
import com.votingsystem.dto.vote.VotingHistoryResponse;

public interface VoteService {

    VoteReceiptResponse castVote(Long userId, Long electionId, Long electionCandidateId);

    PageResponse<VotingHistoryResponse> getVotingHistory(Long userId, Pageable pageable);
}