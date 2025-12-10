package com.se182393.baidautien.controller;

import com.se182393.baidautien.dto.request.ApiResponse;
import com.se182393.baidautien.dto.request.EmailOtpRequest;
import com.se182393.baidautien.service.EmailService;
import com.se182393.baidautien.service.SESEmailService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/email")
@RequiredArgsConstructor
public class EmailController {

    private final EmailService emailService;
    private final SESEmailService sesEmailService;

    @PostMapping("/request-otp")
    public ApiResponse<String> requestEmailOtp(@RequestBody @Valid EmailOtpRequest request) {
        String result = emailService.sendOtpToEmail(request.getEmail());
        return ApiResponse.<String>builder().result(result).build();
    }

    // Test AWS SES - Send simple email
    @PostMapping("/ses/send-test")
    public ApiResponse<String> sendTestEmail(
            @RequestParam String toEmail,
            @RequestParam(required = false, defaultValue = "Test Email from AWS SES") String subject,
            @RequestParam(required = false, defaultValue = "This is a test email!") String body) {

        String messageId = sesEmailService.sendSimpleEmail(toEmail, subject, body);
        return ApiResponse.<String>builder()
                .result("Email sent successfully. MessageId: " + messageId)
                .build();
    }

    // Test AWS SES - Send HTML email
    @PostMapping("/ses/send-html-test")
    public ApiResponse<String> sendHtmlTestEmail(
            @RequestParam String toEmail,
            @RequestParam(required = false, defaultValue = "Test HTML Email") String subject,
            @RequestParam(required = false, defaultValue = "<h1>Hello!</h1><p>This is a <b>HTML</b> email.</p>") String htmlBody) {

        String messageId = sesEmailService.sendHtmlEmail(toEmail, subject, htmlBody);
        return ApiResponse.<String>builder()
                .result("HTML email sent successfully. MessageId: " + messageId)
                .build();
    }

    // Test AWS SES - Send OTP email
    @PostMapping("/ses/send-otp")
    public ApiResponse<String> sendOtpEmail(
            @RequestParam String toEmail,
            @RequestParam String otp) {

        String messageId = sesEmailService.sendOTPEmail(toEmail, otp);
        return ApiResponse.<String>builder()
                .result("OTP email sent successfully. MessageId: " + messageId)
                .build();
    }

    // Test AWS SES - Send password reset email
    @PostMapping("/ses/send-password-reset")
    public ApiResponse<String> sendPasswordResetEmail(
            @RequestParam String toEmail,
            @RequestParam String resetToken,
            @RequestParam(required = false, defaultValue = "http://localhost:3000/reset-password") String resetUrl) {

        String messageId = sesEmailService.sendPasswordResetEmail(toEmail, resetToken, resetUrl);
        return ApiResponse.<String>builder()
                .result("Password reset email sent successfully. MessageId: " + messageId)
                .build();
    }

    // Test AWS SES - Send welcome email
    @PostMapping("/ses/send-welcome")
    public ApiResponse<String> sendWelcomeEmail(
            @RequestParam String toEmail,
            @RequestParam String firstName) {

        String messageId = sesEmailService.sendWelcomeEmail(toEmail, firstName);
        return ApiResponse.<String>builder()
                .result("Welcome email sent successfully. MessageId: " + messageId)
                .build();
    }

    // Verify email address in SES
    @PostMapping("/ses/verify-email")
    public ApiResponse<String> verifyEmail(@RequestParam String email) {
        sesEmailService.verifyEmailAddress(email);
        return ApiResponse.<String>builder()
                .result("Verification email sent to: " + email + ". Please check your inbox.")
                .build();
    }
}
