package com.votingsystem.controller;

import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.votingsystem.dto.common.ApiResponse;
import com.votingsystem.dto.common.PageResponse;
import com.votingsystem.dto.election.AdminElectionResponse;
import com.votingsystem.dto.election.ElectionRequest;
import com.votingsystem.entity.enums.ElectionStatus;
import com.votingsystem.security.CustomUserDetails;
import com.votingsystem.service.ElectionService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/admin/elections")
@RequiredArgsConstructor
public class AdminElectionController {

    private final ElectionService electionService;

    @GetMapping
    public ResponseEntity<ApiResponse<PageResponse<AdminElectionResponse>>> getElections(
            @RequestParam(required = false) ElectionStatus status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        Pageable pageable = PageRequest.of(
                Math.max(page, 0),
                Math.min(Math.max(size, 1), 50),
                Sort.by(Sort.Direction.DESC, "createdAt"));

        return ResponseEntity.ok(ApiResponse.success("Elections loaded",
                electionService.getAdminElections(status, pageable)));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<AdminElectionResponse>> getElection(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success("Election loaded",
                electionService.getAdminElection(id)));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<AdminElectionResponse>> createElection(
            @Valid @RequestBody ElectionRequest request,
            @AuthenticationPrincipal CustomUserDetails admin) {

        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success(
                "Election created successfully",
                electionService.createElection(request, admin.getId())));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<AdminElectionResponse>> updateElection(
            @PathVariable Long id,
            @Valid @RequestBody ElectionRequest request,
            @AuthenticationPrincipal CustomUserDetails admin) {

        return ResponseEntity.ok(ApiResponse.success("Election updated successfully",
                electionService.updateElection(id, request, admin.getId())));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteElection(
            @PathVariable Long id,
            @AuthenticationPrincipal CustomUserDetails admin) {

        electionService.deleteElection(id, admin.getId());
        return ResponseEntity.ok(ApiResponse.success("Election deleted successfully"));
    }

    @PatchMapping("/{id}/close")
    public ResponseEntity<ApiResponse<AdminElectionResponse>> closeElection(
            @PathVariable Long id,
            @AuthenticationPrincipal CustomUserDetails admin) {

        return ResponseEntity.ok(ApiResponse.success("Election closed",
                electionService.closeElection(id, admin.getId())));
    }

    @PatchMapping("/{id}/publish")
    public ResponseEntity<ApiResponse<AdminElectionResponse>> publishResults(
            @PathVariable Long id,
            @AuthenticationPrincipal CustomUserDetails admin) {

        return ResponseEntity.ok(ApiResponse.success("Results published",
                electionService.publishResults(id, admin.getId())));
    }
}