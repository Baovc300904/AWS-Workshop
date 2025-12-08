package com.se182393.baidautien.dto.request;

import com.se182393.baidautien.validator.DobConstraint;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UserCreationRequest {

    //cai nay la truyen message ben Errorcode cua minh qa
    @Size(min = 3, message = "USERNAME_INVALID")
     String username;

    @Size(min = 8, message = "INVALID_PASSWORD")
     String password;
     String firstName;
     String lastName;

    @DobConstraint(min = 12,message = "INVALID_DOB")
     LocalDate dob;

    @Email(message = "INVALID_EMAIL")
     String email;

     String emailOtp; // OTP code sent to email

    // Optional phone capture
    @Pattern(regexp = "^(?:\\+?84|0)?[0-9]{9,10}$", message = "INVALID_PHONE")
     String phone;


}
