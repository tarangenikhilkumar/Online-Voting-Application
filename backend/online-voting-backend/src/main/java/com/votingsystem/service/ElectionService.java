package com.votingsystem.service;

import org.springframework.data.domain.Pageable;

import com.votingsystem.dto.common.PageResponse;
import com.votingsystem.dto.election.AdminElectionResponse;
import com.votingsystem.dto.election.ElectionRequest;
import com.votingsystem.dto.election.ElectionResponse;
import com.votingsystem.entity.enums.ElectionStatus;

public interface ElectionService {

    PageResponse<ElectionResponse> getElections(ElectionStatus status, Pageable pageable, Long userId);

    ElectionResponse getElection(Long id, Long userId);

    PageResponse<AdminElectionResponse> getAdminElections(ElectionStatus status, Pageable pageable);

    AdminElectionResponse getAdminElection(Long id);

    AdminElectionResponse createElection(ElectionRequest request, Long adminId);

    AdminElectionResponse updateElection(Long id, ElectionRequest request, Long adminId);

    void deleteElection(Long id, Long adminId);

    AdminElectionResponse closeElection(Long id, Long adminId);

    AdminElectionResponse publishResults(Long id, Long adminId);
}