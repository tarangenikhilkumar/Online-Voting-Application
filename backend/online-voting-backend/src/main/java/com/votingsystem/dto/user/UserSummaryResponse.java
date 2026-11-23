package com.votingsystem.dto.user;

import java.time.LocalDateTime;

import com.votingsystem.entity.User;
import com.votingsystem.entity.enums.AccountStatus;
import com.votingsystem.entity.enums.Role;

public record UserSummaryResponse(
        Long id,
        String fullName,
        String email,
        Role role,
        AccountStatus accountStatus,
        LocalDateTime createdAt) {

    public static UserSummaryResponse from(User user) {
        return new UserSummaryResponse(
                user.getId(),
                user.getFullName(),
                user.getEmail(),
                user.getRole(),
                user.getAccountStatus(),
                user.getCreatedAt());
    }
}