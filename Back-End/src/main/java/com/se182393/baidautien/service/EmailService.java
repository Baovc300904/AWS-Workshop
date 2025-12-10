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

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.mail.javamail.JavaMailSender; // Import mới (thay vì MailSender)
import org.springframework.mail.javamail.MimeMessageHelper; // Import mới
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

        // 1. Tạo mã OTP
        String code = String.format("%06d", new Random().nextInt(1_000_000));

        // 2. Lưu vào DB với thời hạn 20 PHÚT (theo hình ảnh)
        EmailOtp otp = EmailOtp.builder()
                .email(email)
                .code(code)
                .expiresAt(Instant.now().plus(20, ChronoUnit.MINUTES)) // ĐÃ SỬA: 20 phút
                .used(false)
                .build();
        emailOtpRepository.save(otp);

        // 3. Chuẩn bị email HTML
        MimeMessage mimeMessage = mailSender.createMimeMessage();
        try {
            // 'true' để bật chế độ multipart (cho HTML), 'UTF-8' để hỗ trợ tiếng Việt
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true, "UTF-8");

            if (fromAddress != null && !fromAddress.isBlank()) {
                helper.setFrom(fromAddress); // Ví dụ: "support@yourgame.com"
            }
            helper.setTo(email);
            helper.setSubject("Your Sign Up Code"); // Chủ đề chuyên nghiệp

            // 4. Tạo nội dung HTML
            String htmlBody = buildHtmlEmailTemplate(email, code);
            helper.setText(htmlBody, true); // 'true' để chỉ định đây là HTML

            // 5. Gửi mail
            mailSender.send(mimeMessage);

        } catch (MessagingException e) {
            log.error("Failed to send HTML email OTP to " + email, e);
            throw new AppException(ErrorCode.UNAUTHORIZED); // Hoặc một lỗi custom khác
        }

        return "sent"; // Trả về "sent" đơn giản, chuyên nghiệp
    }

    /**
     * Helper riêng để build chuỗi HTML cho email
     * (Sử dụng CSS inline để tương thích tối đa với các trình duyệt mail)
     */
    private String buildHtmlEmailTemplate(String email, String otpCode) {
        // 1. Khởi tạo
        java.util.Random rand = new java.util.Random();
        StringBuilder formattedCodeHtml = new StringBuilder();

        // 2. Xây dựng chuỗi HTML với màu ngẫu nhiên cho từng chữ số
        for (char digit : otpCode.toCharArray()) {
            // Tạo màu ngẫu nhiên (RGB) sáng để dễ đọc trên nền tối
            int r = 150 + rand.nextInt(106); // 150-255
            int g = 150 + rand.nextInt(106); // 150-255
            int b = 150 + rand.nextInt(106); // 150-255

            String randomColor = String.format("#%02x%02x%02x", r, g, b);

            // Thêm style cho từng ký tự
            formattedCodeHtml.append("<span style=\"color: ")
                    .append(randomColor)
                    .append("; padding: 0 5px; display: inline-block;\">")
                    .append(digit)
                    .append("</span>");
        }
        String formattedCode = formattedCodeHtml.toString();

        // Màu sắc chủ đạo
        String darkBg = "#1B2838";      // Nền body
        String cardBg = "#1B2838";      // Nền của card
        String glowColor = "#00e5ff";   // Màu glow
        String lightText = "#a9c1d9";   // Màu chữ phụ
        String brightText = "#ffffff";  // Màu chữ tiêu đề
        String footerBg = "#15202b";    // Nền footer (tối hơn một chút)
        String footerText = "#7a8c9e";  // Màu chữ footer

        return "<!DOCTYPE html>" +
                "<html lang=\"en\">" +
                "<head>" +
                "  <meta charset=\"UTF-8\">" +
                "  <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">" +
                "  <title>Sign Up Code</title>" +
                "</head>" +
                "<body style=\"font-family: Arial, sans-serif; margin: 0; padding: 0; background-color: " + darkBg + ";\">" +
                "  <table width=\"100%\" border=\"0\" cellpadding=\"0\" cellspacing=\"0\" style=\"background-color: " + darkBg + "; padding: 40px 0;\">" +
                "    <tr>" +
                "      <td align=\"center\">" +
                "        <!-- Khung viền gradient bên ngoài -->" +
                "        <table width=\"500\" border=\"0\" cellpadding=\"3\" cellspacing=\"0\" style=\"max-width: 500px; width: 100%; border-radius: 10px; background: linear-gradient(90deg, #ff00de, #00f7ff, #ffc800);\">" +
                "          <tr>" +
                "            <td>" +
                "              <!-- Card nội dung bên trong -->" +
                "              <table width=\"100%\" border=\"0\" cellpadding=\"0\" cellspacing=\"0\" style=\"background-color: " + cardBg + "; border-radius: 8px;\">" +
                "                <!-- Logo -->" +
                "                <tr>" +
                "                  <td align=\"center\" style=\"padding: 30px 0 20px 0;\">" +
                "                    <div style=\"font-size: 28px; font-weight: bold; color: #00B8FF;\">DEVTERIA</div>" +
                "                  </td>" +
                "                </tr>" +
                "                <!-- Header Text -->" +
                "                <tr>" +
                "                  <td align=\"center\" style=\"padding: 0 30px;\">" +
                "                    <h1 style=\"font-size: 24px; font-weight: bold; color: " + brightText + "; margin: 0;\">Let's sign you up</h1>" +
                "                  </td>" +
                "                </tr>" +
                "                <!-- Body Text -->" +
                "                <tr>" +
                "                  <td align=\"center\" style=\"padding: 10px 30px 20px 30px;\">" +
                "                    <p style=\"font-size: 16px; color: " + lightText + "; line-height: 1.5; margin: 0;\">" +
                "                      Use this code to sign up to your account.<br>" +
                "                      This code will expire in 20 minutes" +
                "                    </p>" +
                "                  </td>" +
                "                </tr>" +
                "                <!-- Mã OTP -->" +
                "                <tr>" +
                "                  <td align=\"center\" style=\"padding: 20px 0;\">" +
                "                    <div style=\"font-size: 36px; font-weight: 700; letter-spacing: 8px; text-shadow: 0 0 10px rgba(0, 229, 255, 0.7);\">" +
                formattedCode +
                "                    </div>" +
                "                  </td>" +
                "                </tr>" +
                "                <!-- Info Text -->" +
                "                <tr>" +
                "                  <td align=\"center\" style=\"padding: 20px 30px 30px 30px;\">" +
                "                    <p style=\"font-size: 14px; color: " + lightText + "; line-height: 1.5; margin: 0;\">" +
                "                      This code will securely sign you up using<br>" +
                "                      <span style=\"color: " + glowColor + "; font-weight: 600;\">" + email + "</span>" +
                "                    </p>" +
                "                  </td>" +
                "                </tr>" +
                "                <!-- RGB Divider -->" +
                "                <tr>" +
                "                  <td style=\"padding: 0; font-size: 0; line-height: 0;\">" +
                "                    <div style=\"height: 3px; background: linear-gradient(90deg, #ff00de, #00f7ff, #ffc800);\"></div>" +
                "                  </td>" +
                "                </tr>" +
                "                <!-- Footer -->" +
                "                <tr>" +
                "                  <td align=\"center\" style=\"background-color: " + footerBg + "; padding: 30px;\">" +
                "                    <p style=\"font-size: 14px; color: " + lightText + "; margin: 0 0 15px 0;\">" +
                "                      Follow us for more updates!" +
                "                    </p>" +
                "                    <p style=\"margin: 0 0 20px 0;\">" +
                "                      <a href=\"#\" style=\"color: " + glowColor + "; text-decoration: none; padding: 0 10px; font-weight: bold;\">Facebook</a>" +
                "                      <a href=\"#\" style=\"color: " + glowColor + "; text-decoration: none; padding: 0 10px; font-weight: bold;\">Discord</a>" +
                "                      <a href=\"#\" style=\"color: " + glowColor + "; text-decoration: none; padding: 0 10px; font-weight: bold;\">X (Twitter)</a>" +
                "                    </p>" +
                "                    <p style=\"font-size: 12px; color: " + footerText + "; margin: 0 0 10px 0;\">" +
                "                      If you didn't request this email, you can safely ignore it." +
                "                    </p>" +
                "                    <p style=\"font-size: 12px; color: " + footerText + "; margin: 0;\">" +
                "                      &copy; 2025 Devteria. All rights reserved." +
                "                    </p>" +
                "                  </td>" +
                "                </tr>" +
                "              </table>" +
                "            </td>" +
                "          </tr>" +
                "        </table>" +
                "      </td>" +
                "    </tr>" +
                "  </table>" +
                "</body>" +
                "</html>";
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


