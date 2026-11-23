package com.votingsystem.service;

import com.votingsystem.dto.dashboard.AdminDashboardResponse;
import com.votingsystem.dto.dashboard.VoterDashboardResponse;

public interface DashboardService {

    AdminDashboardResponse getAdminDashboard();

    VoterDashboardResponse getVoterDashboard(Long userId);
}