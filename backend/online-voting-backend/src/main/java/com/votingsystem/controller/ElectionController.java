package com.votingsystem.controller;

import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.votingsystem.dto.common.ApiResponse;
import com.votingsystem.dto.common.PageResponse;
import com.votingsystem.dto.election.ElectionResponse;
import com.votingsystem.entity.enums.ElectionStatus;
import com.votingsystem.security.CustomUserDetails;
import com.votingsystem.service.ElectionService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/elections")
@RequiredArgsConstructor
public class ElectionController {

    private final ElectionService electionService;

    @GetMapping
    public ResponseEntity<ApiResponse<PageResponse<ElectionResponse>>> getElections(
            @RequestParam(required = false) ElectionStatus status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "6") int size,
            @AuthenticationPrincipal CustomUserDetails user) {

        Pageable pageable = PageRequest.of(
                Math.max(page, 0),
                Math.min(Math.max(size, 1), 50),
                Sort.by(Sort.Direction.DESC, "startDate"));

        return ResponseEntity.ok(ApiResponse.success("Elections loaded",
                electionService.getElections(status, pageable, user.getId())));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ElectionResponse>> getElection(
            @PathVariable Long id,
            @AuthenticationPrincipal CustomUserDetails user) {

        return ResponseEntity.ok(ApiResponse.success("Election loaded",
                electionService.getElection(id, user.getId())));
    }
}