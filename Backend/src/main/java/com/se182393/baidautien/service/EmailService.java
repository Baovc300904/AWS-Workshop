package com.se182393.baidautien.service;

import com.se182393.baidautien.entity.EmailOtp;
import com.se182393.baidautien.exception.AppException;
import com.se182393.baidautien.exception.ErrorCode;
import com.se182393.baidautien.repository.EmailOtpRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Random;

@Slf4j
@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class EmailService {

    final JavaMailSender mailSender;
    final EmailOtpRepository emailOtpRepository;
    @Value("${spring.mail.username:}")
    String fromAddress;

    public String sendOtpToEmail(String email) {
        if (email == null || email.isBlank()) {
            throw new AppException(ErrorCode.INVALID_KEY);
        }
        String code = String.format("%06d", new Random().nextInt(1_000_000));
        EmailOtp otp = EmailOtp.builder()
                .email(email)
                .code(code)
                .expiresAt(Instant.now().plus(5, ChronoUnit.MINUTES))
                .used(false)
                .build();
        emailOtpRepository.save(otp);

        SimpleMailMessage message = new SimpleMailMessage();
        if (fromAddress != null && !fromAddress.isBlank()) {
            message.setFrom(fromAddress);
        }
        message.setTo(email);
        message.setSubject("Your OTP Code");
        message.setText("Your OTP code is: " + code + " (valid 5 minutes)");
        try {
            mailSender.send(message);
        } catch (Exception e) {
            log.error("Failed to send email OTP", e);
            throw new AppException(ErrorCode.UNAUTHORIZED);
        }
        return "sent";
    }

    public void verifyEmailOtp(String email, String code) {
        var latest = emailOtpRepository.findTopByEmailOrderByExpiresAtDesc(email)
                .orElseThrow(() -> new AppException(ErrorCode.UNAUTHORIZED));
        if (latest.isUsed() || latest.getExpiresAt().isBefore(Instant.now()) || !latest.getCode().equals(code)) {
            throw new AppException(ErrorCode.UNAUTHORIZED);
        }
        latest.setUsed(true);
        emailOtpRepository.save(latest);
    }
}


