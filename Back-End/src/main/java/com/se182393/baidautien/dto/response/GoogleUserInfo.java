package com.se182393.baidautien.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class GoogleUserInfo {
    String email;
    String name;
    String picture;
    String givenName;
    String familyName;
    String sub; // Google user ID
    boolean emailVerified;
}

