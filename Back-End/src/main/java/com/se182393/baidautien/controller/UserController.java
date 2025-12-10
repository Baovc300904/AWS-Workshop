package com.se182393.baidautien.controller;


import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.se182393.baidautien.dto.request.AdminUserCreationRequest;
import com.se182393.baidautien.dto.request.ApiResponse;
import com.se182393.baidautien.dto.request.EmailForgotConfirmRequest;
import com.se182393.baidautien.dto.request.EmailForgotOtpRequest;
import com.se182393.baidautien.dto.request.PasswordResetConfirmRequest;
import com.se182393.baidautien.dto.request.PasswordResetRequest;
import com.se182393.baidautien.dto.request.PhoneOtpRequest;
import com.se182393.baidautien.dto.request.UserCreationRequest;
import com.se182393.baidautien.dto.request.UserUpdateRequest;
import com.se182393.baidautien.dto.response.UserResponse;
import com.se182393.baidautien.service.UserService;

import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/users")
@Slf4j
public class UserController {

    @Autowired
    private UserService userService;

    @Autowired
    private com.se182393.baidautien.service.S3Service s3Service;

    @PostMapping
    ApiResponse<UserResponse> createUser(@RequestBody @Valid UserCreationRequest request) {
        return ApiResponse.<UserResponse>builder()
                .result(userService.createRequest(request))
                .build();
    }

    // Create user with custom roles (for admin) - permitAll để có thể tạo admin đầu tiên
    @PostMapping("/create-with-roles")
    ApiResponse<UserResponse> createUserWithRoles(@RequestBody @Valid AdminUserCreationRequest request) {
        return ApiResponse.<UserResponse>builder()
                .result(userService.createUserWithRoles(request))
                .build();
    }

    // Request phone OTP for registration/forgot password (demo: return code in response; real app send via SMS)
    @PostMapping("/request-phone-otp")
    ApiResponse<String> requestPhoneOtp(@RequestBody @Valid PhoneOtpRequest request) {
        String code = userService.requestPhoneOtp(request.getPhone());
        return ApiResponse.<String>builder()
                .result(code)
                .build();
    }

    // Forgot password: step 1 - request OTP by email
    @PostMapping("/forgot-password/email/request")
    ApiResponse<String> forgotByEmailRequest(@RequestBody @Valid EmailForgotOtpRequest request) {
        String result = userService.requestForgotPasswordOtpByEmail(request.getEmail());
        return ApiResponse.<String>builder()
                .result(result)
                .message("OTP đã được gửi đến email của bạn")
                .build();
    }

    // Forgot password: step 2 - confirm OTP and set new password
    @PostMapping("/forgot-password/email/confirm")
    ApiResponse<Void> forgotByEmailConfirm(@RequestBody @Valid EmailForgotConfirmRequest request) {
        userService.confirmForgotPasswordByEmailOtp(request.getEmail(), request.getOtp(), request.getNewPassword());
        return ApiResponse.<Void>builder()
                .message("Mật khẩu đã được cập nhật thành công")
                .build();
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    ApiResponse<List<UserResponse>> getAllUsers() {

        //cái này là khi xài token truy cập vào các endpoint cần token,nó sẽ show trong console ra tên người dùng và scope họ có
        //cái SecurityContextHolder chỉ xài khi người dùng đã login và token đã ra lò nên mới cần phải gọi để lấy thông tin trong tủ đồ
        var authentication = SecurityContextHolder.getContext().getAuthentication();
        log.info(("Username: {}"), authentication.getName());

        authentication.getAuthorities().forEach(grantedAuthority -> log.info(grantedAuthority.getAuthority()));


        return ApiResponse.<List<UserResponse>>builder()
                .result(userService.getUsers())
                .build();
    }

    @GetMapping("/{userId}")
    ApiResponse<UserResponse> getUserById(@PathVariable("userId") String userId) {
        return ApiResponse.<UserResponse>builder()
                .result(userService.getUserById(userId))
                .build();
    }


    @GetMapping("/myInfo")
    ApiResponse<UserResponse> getMyInfo() {
        return ApiResponse.<UserResponse>builder()
                .result(userService.getMyInfo())
                .build();
    }

    @PutMapping("/{userId}")
    ApiResponse<UserResponse> updateUser( @PathVariable("userId") String userId,@RequestBody UserUpdateRequest request) {
        return ApiResponse.<UserResponse>builder()
                .result(userService.updateUser(userId, request))
                .build();
    }


    @DeleteMapping("/{userId}")
    String deleteUser(@PathVariable("userId") String userId) {
         userService.deleteUserById(userId);
         return "User Deleted Successfully";
    }

    @PostMapping("/forgot-password")
    ApiResponse<String> forgotPassword(@RequestBody PasswordResetRequest request) {
        String token = userService.requestPasswordReset(request);
        return ApiResponse.<String>builder()
                .result(token)
                .build();
    }

    @PostMapping("/reset-password")
    ApiResponse<Void> resetPassword(@RequestBody PasswordResetConfirmRequest request) {
        userService.confirmPasswordReset(request);
        return ApiResponse.<Void>builder()
                .message("Bạn đã cập nhật mật khẩu thành công")
                .build();
    }

    // Admin: grant permissions to all roles of a user by username
    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/grant-permissions/{username}")
    ApiResponse<Void> grantPermissions(@PathVariable String username, @RequestBody List<String> permissions) {
        userService.addPermissionsToUserRoles(username, permissions);
        return ApiResponse.<Void>builder().build();
    }

    // Upload avatar for current user
    @PostMapping(value = "/avatar", consumes = "multipart/form-data")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    ApiResponse<UserResponse> uploadAvatar(@RequestParam("file") MultipartFile file) {
        try {
            // Validate file
            if (file == null || file.isEmpty()) {
                throw new IllegalArgumentException("File is required");
            }

            // Get current user
            var context = SecurityContextHolder.getContext();
            String username = context.getAuthentication().getName();
            
            log.info("Uploading avatar for user: {}, filename: {}, size: {}",
                    username, file.getOriginalFilename(), file.getSize());

            // Upload to S3
            String avatarUrl = s3Service.uploadFile(file, "avatars");
            
            // Update user avatar
            UserResponse updated = userService.updateAvatar(username, avatarUrl);
            
            return ApiResponse.<UserResponse>builder()
                    .result(updated)
                    .message("Avatar uploaded successfully")
                    .build();
        } catch (Exception e) {
            log.error("Error uploading avatar", e);
            throw new RuntimeException("Failed to upload avatar: " + e.getMessage());
        }
    }

    // Delete avatar for current user
    @DeleteMapping("/avatar")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    ApiResponse<UserResponse> deleteAvatar() {
        try {
            var context = SecurityContextHolder.getContext();
            String username = context.getAuthentication().getName();
            
            UserResponse updated = userService.updateAvatar(username, null);
            
            return ApiResponse.<UserResponse>builder()
                    .result(updated)
                    .message("Avatar deleted successfully")
                    .build();
        } catch (Exception e) {
            log.error("Error deleting avatar", e);
            throw new RuntimeException("Failed to delete avatar: " + e.getMessage());
        }
    }
}
