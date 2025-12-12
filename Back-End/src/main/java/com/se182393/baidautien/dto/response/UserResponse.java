package com.se182393.baidautien.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;
import java.util.Set;

@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
@ToString
public class UserResponse {
     String id;
     String username;
     String firstName;
     String lastName;
     LocalDate dob;
     String phone;
     String email;
     String avatarUrl;
     Double balance;

    Set<RoleResponse> roles;

    public Set<RoleResponse> getRoles() {
        return roles;
    }

    public void setRoles(Set<RoleResponse> roles) {
        this.roles = roles;
    }

    public String getId() {
          return id;
     }

     public void setId(String id) {
          this.id = id;
     }

     public String getUsername() {
          return username;
     }

     public void setUsername(String username) {
          this.username = username;
     }

     public String getFirstName() {
          return firstName;
     }

     public void setFirstName(String firstName) {
          this.firstName = firstName;
     }

     public String getLastName() {
          return lastName;
     }

     public void setLastName(String lastName) {
          this.lastName = lastName;
     }

     public LocalDate getDob() {
          return dob;
     }

     public void setDob(LocalDate dob) {
          this.dob = dob;
     }

     public String getPhone() {
          return phone;
     }

     public void setPhone(String phone) {
          this.phone = phone;
     }

     public String getEmail() {
          return email;
     }

     public void setEmail(String email) {
          this.email = email;
     }

     public String getAvatarUrl() {
          return avatarUrl;
     }

     public void setAvatarUrl(String avatarUrl) {
          this.avatarUrl = avatarUrl;
     }

     public Double getBalance() {
          return balance;
     }

     public void setBalance(Double balance) {
          this.balance = balance;
     }
}
