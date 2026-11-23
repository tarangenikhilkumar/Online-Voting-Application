package com.votingsystem.dto.user;

import com.votingsystem.entity.User;
import com.votingsystem.entity.enums.Role;
import com.votingsystem.security.CustomUserDetails;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class UserResponse {

    private final Long id;
    private final String fullName;
    private final String email;
    private final Role role;

    public static UserResponse from(User user) {
        return UserResponse.builder()
                .id(user.getId())
                .fullName(user.getFullName())
                .email(user.getEmail())
                .role(user.getRole())
                .build();
    }

    public static UserResponse from(CustomUserDetails user) {
        return UserResponse.builder()
                .id(user.getId())
                .fullName(user.getFullName())
                .email(user.getEmail())
                .role(user.getRole())
                .build();
    }
}