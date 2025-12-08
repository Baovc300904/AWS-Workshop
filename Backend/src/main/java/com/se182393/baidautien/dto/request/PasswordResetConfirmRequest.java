package com.se182393.baidautien.dto.request;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Size;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class PasswordResetConfirmRequest {
    String token;
    @Size(min = 8, message = "INVALID_PASSWORD")
    String newPassword;
}


