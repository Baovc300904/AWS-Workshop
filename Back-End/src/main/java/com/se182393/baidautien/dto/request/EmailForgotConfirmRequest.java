package com.se182393.baidautien.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class EmailForgotConfirmRequest {
    @NotBlank
    @Email(message = "Invalid email format")
    String email;

    @NotBlank
    String otp;

    @Size(min = 8, message = "INVALID_PASSWORD")
    String newPassword;
}

