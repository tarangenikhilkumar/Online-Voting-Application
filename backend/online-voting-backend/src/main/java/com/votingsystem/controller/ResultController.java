package com.votingsystem.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.votingsystem.dto.common.ApiResponse;
import com.votingsystem.dto.election.ElectionResultResponse;
import com.votingsystem.service.ResultService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/results")
@RequiredArgsConstructor
public class ResultController {

    private final ResultService resultService;

    @GetMapping("/{electionId}")
    public ResponseEntity<ApiResponse<ElectionResultResponse>> getResults(
            @PathVariable Long electionId,
            Authentication authentication) {
        boolean isAdmin = authentication.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));
        ElectionResultResponse result = resultService.getElectionResults(electionId, isAdmin);
        return ResponseEntity.ok(ApiResponse.success("Results fetched successfully", result));
    }
}