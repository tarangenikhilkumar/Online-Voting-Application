package com.votingsystem.dto.dashboard;

import java.util.List;

import com.votingsystem.dto.election.AdminElectionResponse;
import com.votingsystem.entity.enums.ElectionStatus;

public record AdminDashboardResponse(
        long totalVoters,
        long totalCandidates,
        long totalElections,
        long totalVotes,
        long activeElections,
        long upcomingElections,
        List<ElectionStat> electionStats,
        List<StatusCount> statusBreakdown,
        List<AdminElectionResponse> recentElections) {

    public record ElectionStat(String title, long totalVotes) {
    }

    public record StatusCount(ElectionStatus status, long count) {
    }
}