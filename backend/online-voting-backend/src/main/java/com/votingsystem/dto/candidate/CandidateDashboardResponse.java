package com.votingsystem.dto.candidate;

import java.util.List;

public record CandidateDashboardResponse(
        long totalApplications,
        long pendingApplications,
        long approvedApplications,
        long rejectedApplications,
        boolean profileComplete,
        List<ApplicationResponse> recentApplications) {
}