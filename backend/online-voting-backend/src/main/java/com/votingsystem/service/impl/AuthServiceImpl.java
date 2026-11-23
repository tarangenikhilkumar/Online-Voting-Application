package com.votingsystem.service.impl;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.Base64;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.votingsystem.dto.auth.AuthResponse;
import com.votingsystem.dto.auth.ForgotPasswordRequest;
import com.votingsystem.dto.auth.LoginRequest;
import com.votingsystem.dto.auth.RegisterRequest;
import com.votingsystem.dto.auth.ResetPasswordRequest;
import com.votingsystem.dto.user.UserResponse;
import com.votingsystem.entity.CandidateProfile;
import com.votingsystem.entity.PasswordResetToken;
import com.votingsystem.entity.User;
import com.votingsystem.entity.VoterProfile;
import com.votingsystem.entity.enums.Role;
import com.votingsystem.exception.BadRequestException;
import com.votingsystem.repository.CandidateProfileRepository;
import com.votingsystem.repository.PasswordResetTokenRepository;
import com.votingsystem.repository.UserRepository;
import com.votingsystem.repository.VoterProfileRepository;
import com.votingsystem.security.CustomUserDetails;
import com.votingsystem.security.JwtUtil;
import com.votingsystem.service.AuditLogService;
import com.votingsystem.service.AuthService;
import com.votingsystem.service.EmailService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private static final SecureRandom SECURE_RANDOM = new SecureRandom();

    private final UserRepository userRepository;
    private final VoterProfileRepository voterProfileRepository;
    private final CandidateProfileRepository candidateProfileRepository;
    private final PasswordResetTokenRepository resetTokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;
    private final AuditLogService auditLogService;
    private final EmailService emailService;

    @Value("${app.reset-token-expiry-minutes}")
    private long resetTokenExpiryMinutes;

    @Override
    @Transactional
    public UserResponse register(RegisterRequest request) {
        if (request.getRole() == Role.ADMIN) {
            throw new BadRequestException("Invalid role selected");
        }

        String email = request.getEmail().trim().toLowerCase();
        if (userRepository.existsByEmail(email)) {
            throw new BadRequestException("Email is already registered");
        }

        User user = userRepository.save(User.builder()
                .fullName(request.getFullName().trim())
                .email(email)
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .role(request.getRole())
                .build());

        if (user.getRole() == Role.VOTER) {
            voterProfileRepository.save(VoterProfile.builder()
                    .user(user)
                    .voterIdNumber(String.format("VTR-%06d", user.getId()))
                    .build());
        } else {
            candidateProfileRepository.save(CandidateProfile.builder()
                    .user(user)
                    .build());
        }

        auditLogService.log(user.getId(), "USER_REGISTERED", "Role: " + user.getRole());
        return UserResponse.from(user);
    }

    @Override
    public AuthResponse login(LoginRequest request) {
        String email = request.getEmail().trim().toLowerCase();

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(email, request.getPassword()));

        CustomUserDetails principal = (CustomUserDetails) authentication.getPrincipal();
        String token = jwtUtil.generateToken(principal);

        auditLogService.log(principal.getId(), "LOGIN", null);

        return AuthResponse.builder()
                .token(token)
                .user(UserResponse.from(principal))
                .build();
    }

    @Override
    @Transactional
    public void forgotPassword(ForgotPasswordRequest request) {
        String email = request.getEmail().trim().toLowerCase();

        userRepository.findByEmail(email).ifPresent(user -> {
            resetTokenRepository.deleteAllByUserId(user.getId());

            String token = generateToken();
            resetTokenRepository.save(PasswordResetToken.builder()
                    .user(user)
                    .token(token)
                    .expiryDate(LocalDateTime.now().plusMinutes(resetTokenExpiryMinutes))
                    .build());

            auditLogService.log(user.getId(), "PASSWORD_RESET_REQUESTED", null);
            emailService.sendPasswordResetEmail(user.getEmail(), user.getFullName(), token);
        });
    }

    @Override
    @Transactional
    public void resetPassword(ResetPasswordRequest request) {
        PasswordResetToken resetToken = resetTokenRepository.findByToken(request.getToken())
                .orElseThrow(() -> new BadRequestException("Invalid or expired reset link"));

        if (resetToken.isUsed() || resetToken.getExpiryDate().isBefore(LocalDateTime.now())) {
            throw new BadRequestException("Invalid or expired reset link");
        }

        User user = resetToken.getUser();
        user.setPasswordHash(passwordEncoder.encode(request.getNewPassword()));
        resetToken.setUsed(true);

        auditLogService.log(user.getId(), "PASSWORD_RESET", null);
    }

    private String generateToken() {
        byte[] bytes = new byte[32];
        SECURE_RANDOM.nextBytes(bytes);
        return Base64.getUrlEncoder().withoutPadding().encodeToString(bytes);
    }
}