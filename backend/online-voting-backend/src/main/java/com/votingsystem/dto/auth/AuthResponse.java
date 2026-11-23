package com.votingsystem.dto.auth;

import com.votingsystem.dto.user.UserResponse;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class AuthResponse {

    private final String token;
    private final UserResponse user;
}