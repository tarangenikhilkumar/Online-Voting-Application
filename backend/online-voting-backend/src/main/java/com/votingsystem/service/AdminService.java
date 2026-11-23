package com.votingsystem.service;

import org.springframework.data.domain.Pageable;

import com.votingsystem.dto.candidate.ApplicationResponse;
import com.votingsystem.dto.common.PageResponse;
import com.votingsystem.dto.user.UserSummaryResponse;
import com.votingsystem.entity.enums.AccountStatus;
import com.votingsystem.entity.enums.ApplicationStatus;
import com.votingsystem.entity.enums.Role;

public interface AdminService {

    PageResponse<ApplicationResponse> getApplications(ApplicationStatus status, Pageable pageable);

    ApplicationResponse reviewApplication(Long applicationId, boolean approve, Long adminId);

    PageResponse<UserSummaryResponse> getUsers(Role role, String keyword, Pageable pageable);

    UserSummaryResponse updateAccountStatus(Long userId, AccountStatus status, Long adminId);
}