package com.votingsystem.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.votingsystem.dto.common.ApiResponse;
import com.votingsystem.dto.dashboard.AdminDashboardResponse;
import com.votingsystem.dto.dashboard.VoterDashboardResponse;
import com.votingsystem.security.CustomUserDetails;
import com.votingsystem.service.DashboardService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class DashboardController {

    private final DashboardService dashboardService;

    @GetMapping("/admin/dashboard")
    public ResponseEntity<ApiResponse<AdminDashboardResponse>> adminDashboard() {
        return ResponseEntity.ok(ApiResponse.success("Dashboard loaded",
                dashboardService.getAdminDashboard()));
    }

    @GetMapping("/voter/dashboard")
    public ResponseEntity<ApiResponse<VoterDashboardResponse>> voterDashboard(
            @AuthenticationPrincipal CustomUserDetails user) {

        return ResponseEntity.ok(ApiResponse.success("Dashboard loaded",
                dashboardService.getVoterDashboard(user.getId())));
    }
}