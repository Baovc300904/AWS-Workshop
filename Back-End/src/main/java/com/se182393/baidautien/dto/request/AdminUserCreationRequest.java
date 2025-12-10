package com.se182393.baidautien.dto.request;

import com.se182393.baidautien.validator.DobConstraint;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class AdminUserCreationRequest {

    @Size(min = 3, message = "USERNAME_INVALID")
    String username;

    @Size(min = 8, message = "INVALID_PASSWORD")
    String password;

    String firstName;
    String lastName;

    @DobConstraint(min = 12, message = "INVALID_DOB")
    LocalDate dob;

    @Email(message = "INVALID_EMAIL")
    String email;

    String emailOtp;

    @Pattern(regexp = "^(?:\\+?84|0)?[0-9]{9,10}$", message = "INVALID_PHONE")
    String phone;

    // List of role names (e.g., ["ADMIN", "USER"])
    @NotEmpty(message = "ROLES_REQUIRED")
    List<String> roles;
}

