package com.votingsystem.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.votingsystem.dto.candidate.BallotCandidateResponse;
import com.votingsystem.dto.common.ApiResponse;
import com.votingsystem.service.CandidateService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/elections/{electionId}/candidates")
@RequiredArgsConstructor
public class ElectionCandidateController {

    private final CandidateService candidateService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<BallotCandidateResponse>>> getCandidates(
            @PathVariable Long electionId) {

        return ResponseEntity.ok(ApiResponse.success("Candidates loaded",
                candidateService.getApprovedCandidates(electionId)));
    }
}