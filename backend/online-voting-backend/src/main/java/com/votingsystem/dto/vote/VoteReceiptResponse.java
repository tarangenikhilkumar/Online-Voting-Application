package com.votingsystem.dto.vote;

import java.time.LocalDateTime;

public record VoteReceiptResponse(
        Long electionId,
        String electionTitle,
        LocalDateTime votedAt) {
}