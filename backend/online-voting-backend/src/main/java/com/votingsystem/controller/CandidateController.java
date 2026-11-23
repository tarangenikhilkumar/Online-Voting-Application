package com.votingsystem.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.votingsystem.dto.candidate.ApplicationRequest;
import com.votingsystem.dto.candidate.ApplicationResponse;
import com.votingsystem.dto.candidate.CandidateDashboardResponse;
import com.votingsystem.dto.candidate.CandidateProfileRequest;
import com.votingsystem.dto.candidate.CandidateProfileResponse;
import com.votingsystem.dto.common.ApiResponse;
import com.votingsystem.security.CustomUserDetails;
import com.votingsystem.service.CandidateService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/candidate")
@RequiredArgsConstructor
public class CandidateController {

    private final CandidateService candidateService;

    @GetMapping("/dashboard")
    public ResponseEntity<ApiResponse<CandidateDashboardResponse>> dashboard(
            @AuthenticationPrincipal CustomUserDetails user) {

        return ResponseEntity.ok(ApiResponse.success("Dashboard loaded",
                candidateService.getDashboard(user.getId())));
    }

    @GetMapping("/profile")
    public ResponseEntity<ApiResponse<CandidateProfileResponse>> getProfile(
            @AuthenticationPrincipal CustomUserDetails user) {

        return ResponseEntity.ok(ApiResponse.success("Profile loaded",
                candidateService.getProfile(user.getId())));
    }

    @PutMapping("/profile")
    public ResponseEntity<ApiResponse<CandidateProfileResponse>> updateProfile(
            @Valid @RequestBody CandidateProfileRequest request,
            @AuthenticationPrincipal CustomUserDetails user) {

        return ResponseEntity.ok(ApiResponse.success("Profile updated",
                candidateService.updateProfile(user.getId(), request)));
    }

    @PostMapping(value = "/profile/image", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ApiResponse<CandidateProfileResponse>> uploadImage(
            @RequestParam("file") MultipartFile file,
            @AuthenticationPrincipal CustomUserDetails user) {

        return ResponseEntity.ok(ApiResponse.success("Profile image updated",
                candidateService.uploadImage(user.getId(), file)));
    }

    @GetMapping("/applications")
    public ResponseEntity<ApiResponse<List<ApplicationResponse>>> myApplications(
            @AuthenticationPrincipal CustomUserDetails user) {

        return ResponseEntity.ok(ApiResponse.success("Applications loaded",
                candidateService.getMyApplications(user.getId())));
    }

    @PostMapping("/applications")
    public ResponseEntity<ApiResponse<ApplicationResponse>> apply(
            @Valid @RequestBody ApplicationRequest request,
            @AuthenticationPrincipal CustomUserDetails user) {

        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success(
                "Application submitted",
                candidateService.apply(user.getId(), request.getElectionId())));
    }

    @DeleteMapping("/applications/{id}")
    public ResponseEntity<ApiResponse<Void>> withdraw(
            @PathVariable Long id,
            @AuthenticationPrincipal CustomUserDetails user) {

        candidateService.withdrawApplication(user.getId(), id);
        return ResponseEntity.ok(ApiResponse.success("Application withdrawn"));
    }
}