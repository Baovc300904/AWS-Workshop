package com.se182393.baidautien.entity;

import java.time.LocalDate;
import java.util.Set;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToMany;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;
import lombok.experimental.FieldDefaults;


@Entity
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Getter
@Setter
@FieldDefaults(level = AccessLevel.PRIVATE)
@ToString
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
     String id;
     String username;
     String password;
     String firstName;
     String lastName;
     LocalDate dob;
     String phone;
     String email;
     String avatarUrl; // Avatar URL (S3 or external)
     Double balance; // User balance for wallet/topup

     // OAuth2 fields
     String provider; // "google", "facebook", "local"
     String providerId; // Google ID, Facebook ID, etc.

    @ManyToMany
    Set<Role> roles;

    // Getter/Setter methods sẽ được Lombok tự động generate, không cần viết thủ công nữa
}
