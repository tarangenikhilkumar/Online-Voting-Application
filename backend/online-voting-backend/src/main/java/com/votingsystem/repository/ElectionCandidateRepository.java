package com.votingsystem.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.votingsystem.entity.ElectionCandidate;
import com.votingsystem.entity.enums.ApplicationStatus;

@Repository
public interface ElectionCandidateRepository extends JpaRepository<ElectionCandidate, Long> {

    @EntityGraph(attributePaths = { "election", "candidateProfile", "candidateProfile.user" })
    Page<ElectionCandidate> findAll(Pageable pageable);

    @EntityGraph(attributePaths = { "election", "candidateProfile", "candidateProfile.user" })
    Page<ElectionCandidate> findByApplicationStatus(ApplicationStatus status, Pageable pageable);

    @EntityGraph(attributePaths = { "election", "candidateProfile", "candidateProfile.user" })
    List<ElectionCandidate> findByElectionIdAndApplicationStatus(Long electionId, ApplicationStatus status);

    @EntityGraph(attributePaths = { "election", "candidateProfile", "candidateProfile.user" })
    List<ElectionCandidate> findByCandidateProfileUserId(Long userId);

    @EntityGraph(attributePaths = { "election", "candidateProfile", "candidateProfile.user" })
    Optional<ElectionCandidate> findByIdAndElectionId(Long id, Long electionId);

    boolean existsByElectionIdAndCandidateProfileId(Long electionId, Long candidateProfileId);

    long countByElectionIdAndApplicationStatus(Long electionId, ApplicationStatus status);

    long countByApplicationStatus(ApplicationStatus status);
}