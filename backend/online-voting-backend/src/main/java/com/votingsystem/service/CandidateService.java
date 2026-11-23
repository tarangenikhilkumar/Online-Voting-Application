package com.votingsystem.service;

import java.util.List;

import org.springframework.web.multipart.MultipartFile;

import com.votingsystem.dto.candidate.ApplicationResponse;
import com.votingsystem.dto.candidate.BallotCandidateResponse;
import com.votingsystem.dto.candidate.CandidateDashboardResponse;
import com.votingsystem.dto.candidate.CandidateProfileRequest;
import com.votingsystem.dto.candidate.CandidateProfileResponse;

public interface CandidateService {

    CandidateProfileResponse getProfile(Long userId);

    CandidateProfileResponse updateProfile(Long userId, CandidateProfileRequest request);

    CandidateProfileResponse uploadImage(Long userId, MultipartFile file);

    ApplicationResponse apply(Long userId, Long electionId);

    List<ApplicationResponse> getMyApplications(Long userId);

    void withdrawApplication(Long userId, Long applicationId);

    CandidateDashboardResponse getDashboard(Long userId);

    List<BallotCandidateResponse> getApprovedCandidates(Long electionId);
}