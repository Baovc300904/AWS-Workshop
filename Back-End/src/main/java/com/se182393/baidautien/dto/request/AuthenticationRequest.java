package com.se182393.baidautien.dto.request;


import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
//class nay de xem coi password ma hoa dung ko
public class AuthenticationRequest {
    String username;
    String password;
}
