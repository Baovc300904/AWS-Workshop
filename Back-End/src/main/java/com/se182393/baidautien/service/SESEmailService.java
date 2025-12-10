package com.se182393.baidautien.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import software.amazon.awssdk.services.ses.SesClient;
import software.amazon.awssdk.services.ses.model.*;

@Service
@RequiredArgsConstructor
@Slf4j
public class SESEmailService {

    private final SesClient sesClient;

    @Value("${aws.ses.from-email:admin@gmail.com}")
    private String fromEmail;

    /**
     * Send simple text email
     */
    public String sendSimpleEmail(String toEmail, String subject, String body) {
        try {
            log.info("Sending email to: {} with subject: {}", toEmail, subject);

            SendEmailRequest emailRequest = SendEmailRequest.builder()
                    .destination(Destination.builder()
                            .toAddresses(toEmail)
                            .build())
                    .message(Message.builder()
                            .subject(Content.builder()
                                    .charset("UTF-8")
                                    .data(subject)
                                    .build())
                            .body(Body.builder()
                                    .text(Content.builder()
                                            .charset("UTF-8")
                                            .data(body)
                                            .build())
                                    .build())
                            .build())
                    .source(fromEmail)
                    .build();

            SendEmailResponse response = sesClient.sendEmail(emailRequest);
            String messageId = response.messageId();

            log.info("Email sent successfully. MessageId: {}", messageId);
            return messageId;

        } catch (SesException e) {
            log.error("Error sending email to {}: {}", toEmail, e.awsErrorDetails().errorMessage());
            throw new RuntimeException("Failed to send email: " + e.awsErrorDetails().errorMessage(), e);
        }
    }

    /**
     * Send HTML email
     */
    public String sendHtmlEmail(String toEmail, String subject, String htmlBody) {
        try {
            log.info("Sending HTML email to: {} with subject: {}", toEmail, subject);

            SendEmailRequest emailRequest = SendEmailRequest.builder()
                    .destination(Destination.builder()
                            .toAddresses(toEmail)
                            .build())
                    .message(Message.builder()
                            .subject(Content.builder()
                                    .charset("UTF-8")
                                    .data(subject)
                                    .build())
                            .body(Body.builder()
                                    .html(Content.builder()
                                            .charset("UTF-8")
                                            .data(htmlBody)
                                            .build())
                                    .build())
                            .build())
                    .source(fromEmail)
                    .build();

            SendEmailResponse response = sesClient.sendEmail(emailRequest);
            String messageId = response.messageId();

            log.info("HTML email sent successfully. MessageId: {}", messageId);
            return messageId;

        } catch (SesException e) {
            log.error("Error sending HTML email to {}: {}", toEmail, e.awsErrorDetails().errorMessage());
            throw new RuntimeException("Failed to send HTML email: " + e.awsErrorDetails().errorMessage(), e);
        }
    }

    /**
     * Send OTP email with beautiful HTML template
     */
    public String sendOTPEmail(String toEmail, String otp) {
        String subject = "Your OTP Code - Shop Game Management";
        String htmlBody = buildOTPEmailTemplate(otp);
        return sendHtmlEmail(toEmail, subject, htmlBody);
    }

    /**
     * Send password reset email
     */
    public String sendPasswordResetEmail(String toEmail, String resetToken, String resetUrl) {
        String subject = "Reset Your Password - Shop Game Management";
        String htmlBody = buildPasswordResetTemplate(resetToken, resetUrl);
        return sendHtmlEmail(toEmail, subject, htmlBody);
    }

    /**
     * Send welcome email to new user
     */
    public String sendWelcomeEmail(String toEmail, String firstName) {
        String subject = "Welcome to Shop Game Management!";
        String htmlBody = buildWelcomeEmailTemplate(firstName);
        return sendHtmlEmail(toEmail, subject, htmlBody);
    }

    /**
     * Build OTP email HTML template
     */
    private String buildOTPEmailTemplate(String otp) {
        return """
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="UTF-8">
                    <style>
                        body { font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0; }
                        .container { max-width: 600px; margin: 20px auto; background-color: #ffffff; padding: 20px; border-radius: 10px; box-shadow: 0 0 10px rgba(0,0,0,0.1); }
                        .header { text-align: center; padding: 20px 0; border-bottom: 2px solid #4CAF50; }
                        .header h1 { color: #4CAF50; margin: 0; }
                        .content { padding: 30px 20px; text-align: center; }
                        .otp-box { background-color: #f8f8f8; padding: 20px; margin: 20px 0; border-radius: 5px; }
                        .otp-code { font-size: 32px; font-weight: bold; color: #4CAF50; letter-spacing: 5px; }
                        .footer { text-align: center; padding: 20px; color: #888; font-size: 12px; border-top: 1px solid #e0e0e0; margin-top: 20px; }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <h1>🎮 Shop Game Management</h1>
                        </div>
                        <div class="content">
                            <h2>Your OTP Code</h2>
                            <p>Please use the following OTP code to complete your verification:</p>
                            <div class="otp-box">
                                <div class="otp-code">""" + otp + """
                </div>
                            </div>
                            <p style="color: #888;">This code will expire in 5 minutes.</p>
                            <p style="color: #ff5722; font-weight: bold;">⚠️ Do not share this code with anyone!</p>
                        </div>
                        <div class="footer">
                            <p>If you didn't request this code, please ignore this email.</p>
                            <p>&copy; 2025 Shop Game Management. All rights reserved.</p>
                        </div>
                    </div>
                </body>
                </html>
                """;
    }

    /**
     * Build password reset email HTML template
     */
    private String buildPasswordResetTemplate(String resetToken, String resetUrl) {
        String fullResetUrl = resetUrl + "?token=" + resetToken;
        return """
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="UTF-8">
                    <style>
                        body { font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0; }
                        .container { max-width: 600px; margin: 20px auto; background-color: #ffffff; padding: 20px; border-radius: 10px; box-shadow: 0 0 10px rgba(0,0,0,0.1); }
                        .header { text-align: center; padding: 20px 0; border-bottom: 2px solid #2196F3; }
                        .header h1 { color: #2196F3; margin: 0; }
                        .content { padding: 30px 20px; }
                        .button { display: inline-block; padding: 15px 30px; background-color: #2196F3; color: #ffffff; text-decoration: none; border-radius: 5px; margin: 20px 0; font-weight: bold; }
                        .button:hover { background-color: #1976D2; }
                        .footer { text-align: center; padding: 20px; color: #888; font-size: 12px; border-top: 1px solid #e0e0e0; margin-top: 20px; }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <h1>🔐 Password Reset Request</h1>
                        </div>
                        <div class="content">
                            <h2>Reset Your Password</h2>
                            <p>We received a request to reset your password. Click the button below to create a new password:</p>
                            <div style="text-align: center;">
                                <a href=\"""" + fullResetUrl + """
                " class="button">Reset Password</a>
                            </div>
                            <p style="color: #888; margin-top: 20px;">Or copy and paste this link into your browser:</p>
                            <p style="word-break: break-all; color: #2196F3;">""" + fullResetUrl + """
                </p>
                            <p style="color: #ff5722; margin-top: 20px;">⚠️ This link will expire in 1 hour.</p>
                        </div>
                        <div class="footer">
                            <p>If you didn't request a password reset, please ignore this email or contact support if you have concerns.</p>
                            <p>&copy; 2025 Shop Game Management. All rights reserved.</p>
                        </div>
                    </div>
                </body>
                </html>
                """;
    }

    /**
     * Build welcome email HTML template
     */
    private String buildWelcomeEmailTemplate(String firstName) {
        return """
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="UTF-8">
                    <style>
                        body { font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0; }
                        .container { max-width: 600px; margin: 20px auto; background-color: #ffffff; padding: 20px; border-radius: 10px; box-shadow: 0 0 10px rgba(0,0,0,0.1); }
                        .header { text-align: center; padding: 20px 0; border-bottom: 2px solid #9C27B0; }
                        .header h1 { color: #9C27B0; margin: 0; }
                        .content { padding: 30px 20px; }
                        .footer { text-align: center; padding: 20px; color: #888; font-size: 12px; border-top: 1px solid #e0e0e0; margin-top: 20px; }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <h1>🎉 Welcome to Shop Game Management!</h1>
                        </div>
                        <div class="content">
                            <h2>Hello """ + firstName + """
                !</h2>
                            <p>Thank you for joining Shop Game Management. We're excited to have you on board!</p>
                            <p>You can now:</p>
                            <ul>
                                <li>🎮 Browse thousands of games</li>
                                <li>🛒 Add games to your cart</li>
                                <li>⭐ Rate and review games</li>
                                <li>💳 Make secure payments</li>
                            </ul>
                            <p style="margin-top: 30px;">Start exploring and enjoy your gaming experience!</p>
                        </div>
                        <div class="footer">
                            <p>Need help? Contact our support team anytime.</p>
                            <p>&copy; 2025 Shop Game Management. All rights reserved.</p>
                        </div>
                    </div>
                </body>
                </html>
                """;
    }

    /**
     * Verify email address in SES (for testing)
     */
    public void verifyEmailAddress(String email) {
        try {
            VerifyEmailIdentityRequest request = VerifyEmailIdentityRequest.builder()
                    .emailAddress(email)
                    .build();

            sesClient.verifyEmailIdentity(request);
            log.info("Verification email sent to: {}", email);

        } catch (SesException e) {
            log.error("Error verifying email {}: {}", email, e.awsErrorDetails().errorMessage());
            throw new RuntimeException("Failed to verify email", e);
        }
    }
}

