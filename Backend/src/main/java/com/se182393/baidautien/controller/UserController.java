package com.se182393.baidautien.controller;


import com.se182393.baidautien.dto.request.ApiResponse;
import com.se182393.baidautien.dto.request.UserCreationRequest;
import com.se182393.baidautien.dto.request.PasswordResetConfirmRequest;
import com.se182393.baidautien.dto.request.PasswordResetRequest;
import com.se182393.baidautien.dto.request.PhoneForgotOtpRequest;
import com.se182393.baidautien.dto.request.PhoneForgotConfirmRequest;
import com.se182393.baidautien.dto.request.UserUpdateRequest;
import com.se182393.baidautien.dto.request.PhoneOtpRequest;
import org.springframework.security.access.prepost.PreAuthorize;
import com.se182393.baidautien.dto.response.UserResponse;
import com.se182393.baidautien.service.UserService;
import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/users")
@Slf4j
public class UserController {

    @Autowired
    private UserService userService;

    @PostMapping
    ApiResponse<UserResponse> createUser(@RequestBody @Valid UserCreationRequest request) {
        return ApiResponse.<UserResponse>builder()
                .result(userService.createRequest(request))
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

    // Forgot password: step 1 - request OTP by username
    @PostMapping("/forgot-password/phone/request")
    ApiResponse<Void> forgotByPhoneRequest(@RequestBody @Valid PhoneForgotOtpRequest request) {
        userService.requestForgotPasswordOtpByUsername(request.getUsername());
        return ApiResponse.<Void>builder().build();
    }

    // Forgot password: step 2 - confirm OTP and set new password
    @PostMapping("/forgot-password/phone/confirm")
    ApiResponse<Void> forgotByPhoneConfirm(@RequestBody @Valid PhoneForgotConfirmRequest request) {
        userService.confirmForgotPasswordByPhoneOtp(request.getUsername(), request.getOtp(), request.getNewPassword());
        return ApiResponse.<Void>builder().build();
    }

    @GetMapping

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
}
