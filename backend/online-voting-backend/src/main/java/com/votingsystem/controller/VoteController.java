package com.votingsystem.controller;

import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.votingsystem.dto.common.ApiResponse;
import com.votingsystem.dto.common.PageResponse;
import com.votingsystem.dto.user.UpdateVoterProfileRequest;
import com.votingsystem.dto.user.VoterProfileResponse;
import com.votingsystem.dto.vote.VoteReceiptResponse;
import com.votingsystem.dto.vote.VoteRequest;
import com.votingsystem.dto.vote.VotingHistoryResponse;
import com.votingsystem.security.CustomUserDetails;
import com.votingsystem.service.VoteService;
import com.votingsystem.service.VoterProfileService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/voter")
@RequiredArgsConstructor
public class VoteController {

    private final VoteService voteService;
    private final VoterProfileService voterProfileService;

    @PostMapping("/elections/{electionId}/vote")
    public ResponseEntity<ApiResponse<VoteReceiptResponse>> castVote(
            @PathVariable Long electionId,
            @Valid @RequestBody VoteRequest request,
            @AuthenticationPrincipal CustomUserDetails user) {

        VoteReceiptResponse receipt =
                voteService.castVote(user.getId(), electionId, request.getElectionCandidateId());

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Your vote has been recorded", receipt));
    }

    @GetMapping("/history")
    public ResponseEntity<ApiResponse<PageResponse<VotingHistoryResponse>>> history(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @AuthenticationPrincipal CustomUserDetails user) {

        Pageable pageable = PageRequest.of(
                Math.max(page, 0),
                Math.min(Math.max(size, 1), 50),
                Sort.by(Sort.Direction.DESC, "votedAt"));

        return ResponseEntity.ok(ApiResponse.success("Voting history loaded",
                voteService.getVotingHistory(user.getId(), pageable)));
    }

    @GetMapping("/profile")
    public ResponseEntity<ApiResponse<VoterProfileResponse>> getProfile(
            @AuthenticationPrincipal CustomUserDetails user) {
        return ResponseEntity.ok(ApiResponse.success("Profile loaded",
                voterProfileService.getProfile(user.getId())));
    }

    @PutMapping("/profile")
    public ResponseEntity<ApiResponse<VoterProfileResponse>> updateProfile(
            @Valid @RequestBody UpdateVoterProfileRequest request,
            @AuthenticationPrincipal CustomUserDetails user) {
        return ResponseEntity.ok(ApiResponse.success("Profile updated",
                voterProfileService.updateProfile(user.getId(), request)));
    }
}