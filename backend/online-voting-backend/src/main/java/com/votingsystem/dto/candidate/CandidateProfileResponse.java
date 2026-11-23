package com.votingsystem.dto.candidate;

import com.votingsystem.entity.CandidateProfile;
import com.votingsystem.entity.User;

public record CandidateProfileResponse(
        Long id,
        String fullName,
        String email,
        String partyName,
        String description,
        String profileImageUrl,
        boolean profileComplete) {

    public static CandidateProfileResponse from(CandidateProfile profile) {
        User user = profile.getUser();
        boolean complete = hasText(profile.getPartyName()) && hasText(profile.getDescription());

        return new CandidateProfileResponse(
                profile.getId(),
                user.getFullName(),
                user.getEmail(),
                profile.getPartyName(),
                profile.getDescription(),
                profile.getProfileImageUrl(),
                complete);
    }

    private static boolean hasText(String value) {
        return value != null && !value.isBlank();
    }
}