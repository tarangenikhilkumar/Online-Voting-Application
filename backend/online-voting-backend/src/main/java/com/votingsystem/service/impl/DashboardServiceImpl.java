package com.votingsystem.service.impl;

import java.util.Arrays;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.votingsystem.dto.dashboard.AdminDashboardResponse;
import com.votingsystem.dto.dashboard.AdminDashboardResponse.ElectionStat;
import com.votingsystem.dto.dashboard.AdminDashboardResponse.StatusCount;
import com.votingsystem.dto.dashboard.VoterDashboardResponse;
import com.votingsystem.dto.election.AdminElectionResponse;
import com.votingsystem.dto.election.ElectionResponse;
import com.votingsystem.entity.Election;
import com.votingsystem.entity.enums.ElectionStatus;
import com.votingsystem.entity.enums.Role;
import com.votingsystem.repository.ElectionRepository;
import com.votingsystem.repository.UserRepository;
import com.votingsystem.repository.VoteRepository;
import com.votingsystem.repository.VoterParticipationRepository;
import com.votingsystem.service.DashboardService;
import com.votingsystem.util.ElectionMapper;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class DashboardServiceImpl implements DashboardService {

    private final UserRepository userRepository;
    private final ElectionRepository electionRepository;
    private final VoteRepository voteRepository;
    private final VoterParticipationRepository participationRepository;
    private final ElectionMapper mapper;

    @Override
    @Transactional(readOnly = true)
    public AdminDashboardResponse getAdminDashboard() {
        List<AdminElectionResponse> recent = electionRepository.findTop5ByOrderByCreatedAtDesc()
                .stream()
                .map(mapper::toAdminResponse)
                .toList();

        List<ElectionStat> stats = recent.stream()
                .map(election -> new ElectionStat(election.title(), election.totalVotes()))
                .toList();

        List<StatusCount> breakdown = Arrays.stream(ElectionStatus.values())
                .map(status -> new StatusCount(status, electionRepository.countByStatus(status)))
                .toList();

        return new AdminDashboardResponse(
                userRepository.countByRole(Role.VOTER),
                userRepository.countByRole(Role.CANDIDATE),
                electionRepository.count(),
                voteRepository.count(),
                electionRepository.countByStatus(ElectionStatus.ACTIVE),
                electionRepository.countByStatus(ElectionStatus.UPCOMING),
                stats,
                breakdown,
                recent);
    }

    @Override
    @Transactional(readOnly = true)
    public VoterDashboardResponse getVoterDashboard(Long userId) {
        List<Election> active = electionRepository.findByStatusOrderByEndDateAsc(ElectionStatus.ACTIVE);

        List<Long> ids = active.stream().map(Election::getId).toList();
        Set<Long> votedIds = ids.isEmpty()
                ? Set.of()
                : new HashSet<>(participationRepository.findVotedElectionIds(userId, ids));

        List<ElectionResponse> activeList = active.stream()
                .map(election -> mapper.toResponse(election, votedIds.contains(election.getId())))
                .toList();

        return new VoterDashboardResponse(
                electionRepository.count(),
                electionRepository.countByStatus(ElectionStatus.ACTIVE),
                electionRepository.countByStatus(ElectionStatus.UPCOMING),
                participationRepository.countByUserId(userId),
                activeList);
    }
}