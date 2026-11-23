package com.votingsystem.service.impl;

import java.util.Comparator;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.votingsystem.dto.candidate.ApplicationResponse;
import com.votingsystem.dto.candidate.BallotCandidateResponse;
import com.votingsystem.dto.candidate.CandidateDashboardResponse;
import com.votingsystem.dto.candidate.CandidateProfileRequest;
import com.votingsystem.dto.candidate.CandidateProfileResponse;
import com.votingsystem.entity.CandidateProfile;
import com.votingsystem.entity.Election;
import com.votingsystem.entity.ElectionCandidate;
import com.votingsystem.entity.enums.ApplicationStatus;
import com.votingsystem.entity.enums.ElectionStatus;
import com.votingsystem.exception.BadRequestException;
import com.votingsystem.exception.ResourceNotFoundException;
import com.votingsystem.repository.CandidateProfileRepository;
import com.votingsystem.repository.ElectionCandidateRepository;
import com.votingsystem.repository.ElectionRepository;
import com.votingsystem.service.AuditLogService;
import com.votingsystem.service.CandidateService;
import com.votingsystem.service.FileStorageService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CandidateServiceImpl implements CandidateService {

    private final CandidateProfileRepository candidateProfileRepository;
    private final ElectionRepository electionRepository;
    private final ElectionCandidateRepository electionCandidateRepository;
    private final FileStorageService fileStorageService;
    private final AuditLogService auditLogService;

    @Override
    @Transactional(readOnly = true)
    public CandidateProfileResponse getProfile(Long userId) {
        return CandidateProfileResponse.from(findProfile(userId));
    }

    @Override
    @Transactional
    public CandidateProfileResponse updateProfile(Long userId, CandidateProfileRequest request) {
        CandidateProfile profile = findProfile(userId);

        profile.setPartyName(request.getPartyName().trim());
        profile.setDescription(request.getDescription().trim());

        auditLogService.log(userId, "CANDIDATE_PROFILE_UPDATED", null);
        return CandidateProfileResponse.from(profile);
    }

    @Override
    @Transactional
    public CandidateProfileResponse uploadImage(Long userId, MultipartFile file) {
        CandidateProfile profile = findProfile(userId);

        String oldImage = profile.getProfileImageUrl();
        String newImage = fileStorageService.storeImage(file);
        profile.setProfileImageUrl(newImage);
        fileStorageService.delete(oldImage);

        auditLogService.log(userId, "CANDIDATE_IMAGE_UPDATED", null);
        return CandidateProfileResponse.from(profile);
    }

    @Override
    @Transactional
    public ApplicationResponse apply(Long userId, Long electionId) {
        CandidateProfile profile = findProfile(userId);

        if (isBlank(profile.getPartyName()) || isBlank(profile.getDescription())) {
            throw new BadRequestException("Complete your profile (party name and description) before applying");
        }

        Election election = electionRepository.findById(electionId)
                .orElseThrow(() -> new ResourceNotFoundException("Election", electionId));

        if (election.getStatus() != ElectionStatus.UPCOMING) {
            throw new BadRequestException("Applications are open only for upcoming elections");
        }

        if (electionCandidateRepository.existsByElectionIdAndCandidateProfileId(electionId, profile.getId())) {
            throw new BadRequestException("You have already applied for this election");
        }

        ElectionCandidate application = electionCandidateRepository.save(ElectionCandidate.builder()
                .election(election)
                .candidateProfile(profile)
                .build());

        auditLogService.log(userId, "ELECTION_APPLICATION", "Election: " + election.getTitle());
        return ApplicationResponse.from(application);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ApplicationResponse> getMyApplications(Long userId) {
        return myApplications(userId);
    }

    @Override
    @Transactional
    public void withdrawApplication(Long userId, Long applicationId) {
        ElectionCandidate application = electionCandidateRepository.findById(applicationId)
                .filter(ec -> ec.getCandidateProfile().getUser().getId().equals(userId))
                .orElseThrow(() -> new ResourceNotFoundException("Application", applicationId));

        if (application.getApplicationStatus() != ApplicationStatus.PENDING) {
            throw new BadRequestException("Only pending applications can be withdrawn");
        }
        if (application.getElection().getStatus() != ElectionStatus.UPCOMING) {
            throw new BadRequestException("This election has already started");
        }

        String title = application.getElection().getTitle();
        electionCandidateRepository.delete(application);
        auditLogService.log(userId, "APPLICATION_WITHDRAWN", "Election: " + title);
    }

    @Override
    @Transactional(readOnly = true)
    public CandidateDashboardResponse getDashboard(Long userId) {
        CandidateProfile profile = findProfile(userId);
        List<ApplicationResponse> applications = myApplications(userId);

        return new CandidateDashboardResponse(
                applications.size(),
                countByStatus(applications, ApplicationStatus.PENDING),
                countByStatus(applications, ApplicationStatus.APPROVED),
                countByStatus(applications, ApplicationStatus.REJECTED),
                CandidateProfileResponse.from(profile).profileComplete(),
                applications.stream().limit(5).toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<BallotCandidateResponse> getApprovedCandidates(Long electionId) {
        if (!electionRepository.existsById(electionId)) {
            throw new ResourceNotFoundException("Election", electionId);
        }

        return electionCandidateRepository
                .findByElectionIdAndApplicationStatus(electionId, ApplicationStatus.APPROVED)
                .stream()
                .map(BallotCandidateResponse::from)
                .toList();
    }

    private CandidateProfile findProfile(Long userId) {
        return candidateProfileRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Candidate profile not found"));
    }

    private List<ApplicationResponse> myApplications(Long userId) {
        return electionCandidateRepository.findByCandidateProfileUserId(userId)
                .stream()
                .map(ApplicationResponse::from)
                .sorted(Comparator.comparing(ApplicationResponse::appliedAt,
                        Comparator.nullsLast(Comparator.reverseOrder())))
                .toList();
    }

    private long countByStatus(List<ApplicationResponse> applications, ApplicationStatus status) {
        return applications.stream().filter(a -> a.status() == status).count();
    }

    private boolean isBlank(String value) {
        return value == null || value.isBlank();
    }
}