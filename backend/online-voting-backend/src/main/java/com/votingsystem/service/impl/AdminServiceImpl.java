package com.votingsystem.service.impl;

import java.time.LocalDateTime;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.votingsystem.dto.candidate.ApplicationResponse;
import com.votingsystem.dto.common.PageResponse;
import com.votingsystem.dto.user.UserSummaryResponse;
import com.votingsystem.entity.ElectionCandidate;
import com.votingsystem.entity.User;
import com.votingsystem.entity.enums.AccountStatus;
import com.votingsystem.entity.enums.ApplicationStatus;
import com.votingsystem.entity.enums.ElectionStatus;
import com.votingsystem.entity.enums.Role;
import com.votingsystem.exception.BadRequestException;
import com.votingsystem.exception.ResourceNotFoundException;
import com.votingsystem.repository.ElectionCandidateRepository;
import com.votingsystem.repository.UserRepository;
import com.votingsystem.service.AdminService;
import com.votingsystem.service.AuditLogService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AdminServiceImpl implements AdminService {

    private final ElectionCandidateRepository electionCandidateRepository;
    private final UserRepository userRepository;
    private final AuditLogService auditLogService;

    @Override
    @Transactional(readOnly = true)
    public PageResponse<ApplicationResponse> getApplications(ApplicationStatus status, Pageable pageable) {
        Page<ElectionCandidate> page = status == null
                ? electionCandidateRepository.findAll(pageable)
                : electionCandidateRepository.findByApplicationStatus(status, pageable);

        return PageResponse.from(page, ApplicationResponse::from);
    }

    @Override
    @Transactional
    public ApplicationResponse reviewApplication(Long applicationId, boolean approve, Long adminId) {
        ElectionCandidate application = electionCandidateRepository.findById(applicationId)
                .orElseThrow(() -> new ResourceNotFoundException("Application", applicationId));

        if (application.getApplicationStatus() != ApplicationStatus.PENDING) {
            throw new BadRequestException("This application has already been reviewed");
        }
        if (application.getElection().getStatus() != ElectionStatus.UPCOMING) {
            throw new BadRequestException("Applications can be reviewed only before the election starts");
        }

        application.setApplicationStatus(approve ? ApplicationStatus.APPROVED : ApplicationStatus.REJECTED);
        application.setReviewedAt(LocalDateTime.now());

        auditLogService.log(adminId,
                approve ? "APPLICATION_APPROVED" : "APPLICATION_REJECTED",
                "Election: " + application.getElection().getTitle());

        return ApplicationResponse.from(application);
    }

    @Override
    @Transactional(readOnly = true)
    public PageResponse<UserSummaryResponse> getUsers(Role role, String keyword, Pageable pageable) {
        if (role == null || role == Role.ADMIN) {
            throw new BadRequestException("Only voters or candidates can be listed");
        }

        Page<User> page = keyword == null || keyword.isBlank()
                ? userRepository.findByRole(role, pageable)
                : userRepository.searchByRole(role, keyword.trim(), pageable);

        return PageResponse.from(page, UserSummaryResponse::from);
    }

    @Override
    @Transactional
    public UserSummaryResponse updateAccountStatus(Long userId, AccountStatus status, Long adminId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", userId));

        if (user.getRole() == Role.ADMIN) {
            throw new BadRequestException("Admin accounts cannot be blocked");
        }

        user.setAccountStatus(status);

        auditLogService.log(adminId,
                status == AccountStatus.BLOCKED ? "USER_BLOCKED" : "USER_UNBLOCKED",
                "User id: " + user.getId());

        return UserSummaryResponse.from(user);
    }
}