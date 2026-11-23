package com.votingsystem.service;

import org.springframework.beans.factory.ObjectProvider;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
public class EmailService {

    private final ObjectProvider<JavaMailSender> mailSenderProvider;

    @Value("${app.frontend-url}")
    private String frontendUrl;

    @Value("${app.reset-token-expiry-minutes}")
    private long expiryMinutes;

    @Value("${spring.mail.username:}")
    private String fromAddress;

    public void sendPasswordResetEmail(String to, String name, String token) {
        String link = frontendUrl + "/reset-password?token=" + token;
        JavaMailSender sender = mailSenderProvider.getIfAvailable();

        if (sender == null) {
            log.info("Mail is not configured. Password reset link for {}: {}", to, link);
            return;
        }

        try {
            SimpleMailMessage message = new SimpleMailMessage();
            if (!fromAddress.isBlank()) {
                message.setFrom(fromAddress);
            }
            message.setTo(to);
            message.setSubject("SecureVote - Reset your password");
            message.setText("Hello " + name + ",\n\n"
                    + "Click the link below to reset your password. It expires in "
                    + expiryMinutes + " minutes.\n\n"
                    + link + "\n\n"
                    + "If you did not request this, you can ignore this email.");
            sender.send(message);
        } catch (Exception ex) {
            log.error("Failed to send reset email to {}", to, ex);
        }
    }
}