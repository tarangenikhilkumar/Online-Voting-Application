package com.votingsystem.service.impl;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.votingsystem.dto.common.PageResponse;
import com.votingsystem.dto.election.AdminElectionResponse;
import com.votingsystem.dto.election.ElectionRequest;
import com.votingsystem.dto.election.ElectionResponse;
import com.votingsystem.entity.Election;
import com.votingsystem.entity.User;
import com.votingsystem.entity.enums.ElectionStatus;
import com.votingsystem.exception.BadRequestException;
import com.votingsystem.exception.ResourceNotFoundException;
import com.votingsystem.repository.ElectionRepository;
import com.votingsystem.repository.UserRepository;
import com.votingsystem.repository.VoterParticipationRepository;
import com.votingsystem.service.AuditLogService;
import com.votingsystem.service.ElectionService;
import com.votingsystem.util.ElectionMapper;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ElectionServiceImpl implements ElectionService {

    private final ElectionRepository electionRepository;
    private final UserRepository userRepository;
    private final VoterParticipationRepository participationRepository;
    private final ElectionMapper mapper;
    private final AuditLogService auditLogService;

    @Override
    @Transactional(readOnly = true)
    public PageResponse<ElectionResponse> getElections(ElectionStatus status, Pageable pageable, Long userId) {
        Page<Election> page = status == null
                ? electionRepository.findAll(pageable)
                : electionRepository.findByStatus(status, pageable);

        List<Long> ids = page.getContent().stream().map(Election::getId).toList();
        Set<Long> votedIds = ids.isEmpty()
                ? Set.of()
                : new HashSet<>(participationRepository.findVotedElectionIds(userId, ids));

        return PageResponse.from(page, election -> mapper.toResponse(election, votedIds.contains(election.getId())));
    }

    @Override
    @Transactional(readOnly = true)
    public ElectionResponse getElection(Long id, Long userId) {
        Election election = findElection(id);
        boolean hasVoted = participationRepository.existsByElectionIdAndUserId(id, userId);
        return mapper.toResponse(election, hasVoted);
    }

    @Override
    @Transactional(readOnly = true)
    public PageResponse<AdminElectionResponse> getAdminElections(ElectionStatus status, Pageable pageable) {
        Page<Election> page = status == null
                ? electionRepository.findAll(pageable)
                : electionRepository.findByStatus(status, pageable);
        return PageResponse.from(page, mapper::toAdminResponse);
    }

    @Override
    @Transactional(readOnly = true)
    public AdminElectionResponse getAdminElection(Long id) {
        return mapper.toAdminResponse(findElection(id));
    }

    @Override
    @Transactional
    public AdminElectionResponse createElection(ElectionRequest request, Long adminId) {
        validateDates(request.getStartDate(), request.getEndDate());

        User admin = userRepository.findById(adminId)
                .orElseThrow(() -> new ResourceNotFoundException("User", adminId));

        Election election = electionRepository.save(Election.builder()
                .title(request.getTitle().trim())
                .description(cleanDescription(request.getDescription()))
                .startDate(request.getStartDate())
                .endDate(request.getEndDate())
                .createdBy(admin)
                .build());

        auditLogService.log(adminId, "ELECTION_CREATED", "Election: " + election.getTitle());
        return mapper.toAdminResponse(election);
    }

    @Override
    @Transactional
    public AdminElectionResponse updateElection(Long id, ElectionRequest request, Long adminId) {
        Election election = findElection(id);

        if (election.getStatus() != ElectionStatus.UPCOMING) {
            throw new BadRequestException("Only upcoming elections can be edited");
        }
        validateDates(request.getStartDate(), request.getEndDate());

        election.setTitle(request.getTitle().trim());
        election.setDescription(cleanDescription(request.getDescription()));
        election.setStartDate(request.getStartDate());
        election.setEndDate(request.getEndDate());

        auditLogService.log(adminId, "ELECTION_UPDATED", "Election: " + election.getTitle());
        return mapper.toAdminResponse(election);
    }

    @Override
    @Transactional
    public void deleteElection(Long id, Long adminId) {
        Election election = findElection(id);

        if (election.getStatus() != ElectionStatus.UPCOMING) {
            throw new BadRequestException("Only upcoming elections can be deleted");
        }

        String title = election.getTitle();
        electionRepository.delete(election);
        auditLogService.log(adminId, "ELECTION_DELETED", "Election: " + title);
    }

    @Override
    @Transactional
    public AdminElectionResponse closeElection(Long id, Long adminId) {
        Election election = findElection(id);

        if (election.getStatus() != ElectionStatus.ACTIVE) {
            throw new BadRequestException("Only active elections can be closed");
        }

        election.setStatus(ElectionStatus.COMPLETED);
        auditLogService.log(adminId, "ELECTION_CLOSED", "Election: " + election.getTitle());
        return mapper.toAdminResponse(election);
    }

    @Override
    @Transactional
    public AdminElectionResponse publishResults(Long id, Long adminId) {
        Election election = findElection(id);

        if (election.getStatus() != ElectionStatus.COMPLETED) {
            throw new BadRequestException("Results can be published only after the election is completed");
        }

        election.setStatus(ElectionStatus.RESULTS_PUBLISHED);
        auditLogService.log(adminId, "RESULTS_PUBLISHED", "Election: " + election.getTitle());
        return mapper.toAdminResponse(election);
    }

    private Election findElection(Long id) {
        return electionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Election", id));
    }

    private void validateDates(LocalDateTime start, LocalDateTime end) {
        if (!end.isAfter(start)) {
            throw new BadRequestException("End date must be after start date");
        }
        if (start.isBefore(LocalDateTime.now())) {
            throw new BadRequestException("Start date must be in the future");
        }
    }

    private String cleanDescription(String description) {
        return description == null || description.isBlank() ? null : description.trim();
    }
}