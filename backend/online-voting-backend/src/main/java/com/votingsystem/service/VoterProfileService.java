package com.votingsystem.service;

import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.votingsystem.dto.user.UpdateVoterProfileRequest;
import com.votingsystem.dto.user.VoterProfileResponse;
import com.votingsystem.entity.User;
import com.votingsystem.exception.ResourceNotFoundException;
import com.votingsystem.repository.UserRepository;
import com.votingsystem.repository.VoterParticipationRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class VoterProfileService {

    private final UserRepository userRepository;
    private final VoterParticipationRepository participationRepository;

    @Transactional(readOnly = true)
    public VoterProfileResponse getProfile(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        long votesCast = participationRepository.findByUserId(userId, PageRequest.of(0, 1)).getTotalElements();

        return new VoterProfileResponse(
                user.getId(),
                user.getFullName(),
                user.getEmail(),
                user.getRole().name(),
                votesCast,
                user.getCreatedAt()
        );
    }

    @Transactional
    public VoterProfileResponse updateProfile(Long userId, UpdateVoterProfileRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        user.setFullName(request.fullName().trim());
        userRepository.save(user);

        return getProfile(userId);
    }
}