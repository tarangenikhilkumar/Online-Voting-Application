package com.votingsystem.dto.dashboard;

import java.util.List;

import com.votingsystem.dto.election.ElectionResponse;

public record VoterDashboardResponse(
        long totalElections,
        long activeElections,
        long upcomingElections,
        long votesCast,
        List<ElectionResponse> activeElectionsList) {
}