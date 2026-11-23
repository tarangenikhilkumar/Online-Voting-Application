package com.votingsystem.service;

import com.votingsystem.dto.auth.AuthResponse;
import com.votingsystem.dto.auth.ForgotPasswordRequest;
import com.votingsystem.dto.auth.LoginRequest;
import com.votingsystem.dto.auth.RegisterRequest;
import com.votingsystem.dto.auth.ResetPasswordRequest;
import com.votingsystem.dto.user.UserResponse;

public interface AuthService {

    UserResponse register(RegisterRequest request);

    AuthResponse login(LoginRequest request);

    void forgotPassword(ForgotPasswordRequest request);

    void resetPassword(ResetPasswordRequest request);
}