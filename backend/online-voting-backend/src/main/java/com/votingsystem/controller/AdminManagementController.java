package com.votingsystem.controller;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.votingsystem.dto.candidate.ApplicationResponse;
import com.votingsystem.dto.common.ApiResponse;
import com.votingsystem.dto.common.PageResponse;
import com.votingsystem.dto.user.UserSummaryResponse;
import com.votingsystem.entity.AuditLog;
import com.votingsystem.entity.enums.AccountStatus;
import com.votingsystem.entity.enums.ApplicationStatus;
import com.votingsystem.entity.enums.Role;
import com.votingsystem.security.CustomUserDetails;
import com.votingsystem.service.AdminService;
import com.votingsystem.service.AuditLogService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminManagementController {

    private final AdminService adminService;
    private final AuditLogService auditLogService;

    @GetMapping("/applications")
    public ResponseEntity<ApiResponse<PageResponse<ApplicationResponse>>> applications(
            @RequestParam(required = false) ApplicationStatus status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        return ResponseEntity.ok(ApiResponse.success("Applications loaded",
                adminService.getApplications(status, pageable(page, size, "appliedAt"))));
    }

    @PatchMapping("/applications/{id}/approve")
    public ResponseEntity<ApiResponse<ApplicationResponse>> approve(
            @PathVariable Long id,
            @AuthenticationPrincipal CustomUserDetails admin) {

        return ResponseEntity.ok(ApiResponse.success("Application approved",
                adminService.reviewApplication(id, true, admin.getId())));
    }

    @PatchMapping("/applications/{id}/reject")
    public ResponseEntity<ApiResponse<ApplicationResponse>> reject(
            @PathVariable Long id,
            @AuthenticationPrincipal CustomUserDetails admin) {

        return ResponseEntity.ok(ApiResponse.success("Application rejected",
                adminService.reviewApplication(id, false, admin.getId())));
    }

    @GetMapping("/voters")
    public ResponseEntity<ApiResponse<PageResponse<UserSummaryResponse>>> voters(
            @RequestParam(required = false) String search,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        return ResponseEntity.ok(ApiResponse.success("Voters loaded",
                adminService.getUsers(Role.VOTER, search, pageable(page, size, "createdAt"))));
    }

    @GetMapping("/candidates")
    public ResponseEntity<ApiResponse<PageResponse<UserSummaryResponse>>> candidates(
            @RequestParam(required = false) String search,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        return ResponseEntity.ok(ApiResponse.success("Candidates loaded",
                adminService.getUsers(Role.CANDIDATE, search, pageable(page, size, "createdAt"))));
    }

    @PatchMapping("/users/{id}/block")
    public ResponseEntity<ApiResponse<UserSummaryResponse>> block(
            @PathVariable Long id,
            @AuthenticationPrincipal CustomUserDetails admin) {

        return ResponseEntity.ok(ApiResponse.success("User blocked",
                adminService.updateAccountStatus(id, AccountStatus.BLOCKED, admin.getId())));
    }

    @PatchMapping("/users/{id}/unblock")
    public ResponseEntity<ApiResponse<UserSummaryResponse>> unblock(
            @PathVariable Long id,
            @AuthenticationPrincipal CustomUserDetails admin) {

        return ResponseEntity.ok(ApiResponse.success("User unblocked",
                adminService.updateAccountStatus(id, AccountStatus.ACTIVE, admin.getId())));
    }

    @GetMapping("/audit-logs")
    public ResponseEntity<ApiResponse<Page<AuditLog>>> auditLogs(
            @RequestParam(required = false) String search,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "15") int size) {

        return ResponseEntity.ok(ApiResponse.success("Audit logs loaded",
                auditLogService.getLogs(search, pageable(page, size, "createdAt"))));
    }

    private Pageable pageable(int page, int size, String sortBy) {
        return PageRequest.of(
                Math.max(page, 0),
                Math.min(Math.max(size, 1), 50),
                Sort.by(Sort.Direction.DESC, sortBy));
    }
}