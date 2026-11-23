package com.votingsystem.dto.user;

import java.time.LocalDateTime;

public record VoterProfileResponse(
        Long id,
        String fullName,
        String email,
        String role,
        long totalVotesCast,
        LocalDateTime createdAt
) {
}