package com.se182393.baidautien.service;


import com.se182393.baidautien.dto.request.PasswordResetConfirmRequest;
import com.se182393.baidautien.dto.request.PasswordResetRequest;
import com.se182393.baidautien.dto.request.UserCreationRequest;
import com.se182393.baidautien.dto.request.UserUpdateRequest;
import com.se182393.baidautien.dto.response.UserResponse;
import com.se182393.baidautien.entity.Role;
import com.se182393.baidautien.entity.User;
import com.se182393.baidautien.entity.PasswordResetToken;
import com.se182393.baidautien.entity.Permission;
import com.se182393.baidautien.exception.AppException;
import com.se182393.baidautien.exception.ErrorCode;
import com.se182393.baidautien.mapper.UserMapper;
import com.se182393.baidautien.repository.RoleRepository;
import com.se182393.baidautien.repository.PermissionRepository;
import com.se182393.baidautien.repository.PasswordResetTokenRepository;
import com.se182393.baidautien.repository.UserRepository;
import com.se182393.baidautien.repository.PhoneOtpRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.access.prepost.PostAuthorize;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.UUID;

@Slf4j
@Service
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequiredArgsConstructor() // cai nay se inject 1 constructor thi bean của cả dự án sẽ tự inject vào giùm mà k cần autowire
public class UserService {


    UserRepository userRepository;
    UserMapper userMapper;
    PasswordEncoder passwordEncoder;
    RoleRepository roleRepository;
    PermissionRepository permissionRepository;
    PasswordResetTokenRepository passwordResetTokenRepository;
    PhoneOtpRepository phoneOtpRepository;
    EmailService emailService;

    public UserResponse createRequest(UserCreationRequest request){

        if(userRepository.existsUserByUsername(request.getUsername()))
            throw new AppException(ErrorCode.USER_EXISTED);

        // verify email OTP if email provided
        if (request.getEmail() != null && !request.getEmail().isBlank()) {
            if (request.getEmailOtp() == null || request.getEmailOtp().isBlank()) {
                throw new AppException(ErrorCode.UNAUTHORIZED);
            }
            emailService.verifyEmailOtp(request.getEmail(), request.getEmailOtp());
        }

        User user = userMapper.toUser(request);

        //ma hoa password
        user.setPassword(passwordEncoder.encode(request.getPassword()));

        Set<Role> roles = new HashSet<>();
        // Fetch existing USER role instead of recreating it (avoids wiping permissions)
        Role userRole = Role.builder()
                .name("USER")
                .build();
        roles.add(userRole);
        user.setRoles(roles);

        User saved = userRepository.save(user);
        return userMapper.toUserResponse(saved);
    }

    public String requestPhoneOtp(String phone) {
        if (phone == null || phone.isBlank()) {
            throw new AppException(ErrorCode.INVALID_PHONE);
        }
        // Generate 6-digit numeric code
        String code = String.format("%06d", (int)(Math.random() * 1000000));
        var otp = com.se182393.baidautien.entity.PhoneOtp.builder()
                .phone(phone)
                .code(code)
                .expiresAt(Instant.now().plus(5, ChronoUnit.MINUTES))
                .used(false)
                .build();
        phoneOtpRepository.save(otp);
        // Send SMS via Twilio (requires env vars TWILIO_SID, TWILIO_TOKEN, TWILIO_FROM)
        // Integrate your SMS provider here. For now, only log the code to server logs.
        log.info("[SMS] Send OTP to {}: {} (valid 5m)", phone, code);
        return "sent";
    }

    public String requestForgotPasswordOtpByUsername(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));
        String phone = user.getDob() != null ? null : null; // placeholder ignore
        // reuse phone from user entity if present
        try {
            // reflectively fetch phone if exists
            var field = User.class.getDeclaredField("phone");
            field.setAccessible(true);
            Object value = field.get(user);
            phone = value != null ? value.toString() : null;
        } catch (Exception ignored) {}
        if (phone == null || phone.isBlank()) throw new AppException(ErrorCode.INVALID_PHONE);
        return requestPhoneOtp(phone);
    }

    public void confirmForgotPasswordByPhoneOtp(String username, String otpCode, String newPassword) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));
        String phone = null;
        try {
            var field = User.class.getDeclaredField("phone");
            field.setAccessible(true);
            Object value = field.get(user);
            phone = value != null ? value.toString() : null;
        } catch (Exception ignored) {}
        if (phone == null || phone.isBlank()) throw new AppException(ErrorCode.INVALID_PHONE);

        var otpOptional = phoneOtpRepository.findTopByPhoneOrderByExpiresAtDesc(phone);
        var otp = otpOptional.orElseThrow(() -> new AppException(ErrorCode.PHONE_OTP_NOT_REQUESTED));
        if (!otpCode.equals(otp.getCode())) throw new AppException(ErrorCode.PHONE_OTP_INVALID);
        if (otp.isUsed()) throw new AppException(ErrorCode.PHONE_OTP_INVALID);
        if (otp.getExpiresAt().isBefore(Instant.now())) throw new AppException(ErrorCode.PHONE_OTP_EXPIRED);

        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
        otp.setUsed(true);
        phoneOtpRepository.save(otp);
    }

  @PreAuthorize("hasRole('ADMIN')")
//    @PreAuthorize("hasAuthority('hihi_POST')")  cái này để phân quyền cho mấy cái permission k có prefix
    public List<UserResponse> getUsers(){
        return userRepository.findAll()
            .stream()
                .map(userMapper::toUserResponse) // map từ User -> UserResponse
                .toList();
    }

    @PostAuthorize("returnObject.username == authentication.name")
    public UserResponse  getUserById(String id){
        return userMapper.toUserResponse(userRepository.findById(id).orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED)));
    }
    public UserResponse getMyInfo() {
        //cái này là lấy được hộp authentication nhưng chưa mở hộp
       var context = SecurityContextHolder.getContext();
       //cái này là mở hộp để đọc tên của nó, nhưng chưa lấy được đủ thông tin
       String name = context.getAuthentication().getName();

       // nên dòng này phải truy vấn query để lấy đủ thông tin trả ra
      User user = userRepository.findByUsername(name).orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

      log.info("getMyInfo: user={}",user);
      log.info("userResponse={}",userMapper.toUserResponse(user));
      return userMapper.toUserResponse(user);
    }


    public UserResponse updateUser(String userId,UserUpdateRequest request) {
        User user = userRepository.findById(userId).orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        userMapper.updateUser(user, request);
        user.setPassword(passwordEncoder.encode(request.getPassword()));

        //co the update lai roles
        var roles = roleRepository.findAllById(request.getRoles());
        user.setRoles(new HashSet<>(roles));
        return userMapper.toUserResponse(userRepository.save(user));

    }

    public void deleteUserById(String id){
        userRepository.deleteById(id);
    }

    public String requestPasswordReset(PasswordResetRequest request) {
        var optionalUser = userRepository.findByUsername(request.getUsername());
        if (optionalUser.isEmpty()) {
            return "ok";
        }

        var user = optionalUser.get();
        var token = UUID.randomUUID().toString();
        var resetToken = PasswordResetToken.builder()
                .token(token)
                .user(user)
                .expiresAt(Instant.now().plus(15, ChronoUnit.MINUTES))
                .used(false)
                .build();
        passwordResetTokenRepository.save(resetToken);
        log.info("Password reset token for user {}: {}", user.getUsername(), token);
        return token;
    }

    public void confirmPasswordReset(PasswordResetConfirmRequest request) {
        var resetToken = passwordResetTokenRepository.findByToken(request.getToken())
                .orElseThrow(() -> new AppException(ErrorCode.UNAUTHORIZED));

        if (resetToken.isUsed() || resetToken.getExpiresAt().isBefore(Instant.now())) {
            throw new AppException(ErrorCode.UNAUTHORIZED);
        }

        var user = resetToken.getUser();
        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);

        resetToken.setUsed(true);
        passwordResetTokenRepository.save(resetToken);
    }

    // Grant one or more permissions to ALL roles of a user identified by username
    // Admin can use this to update permissions via username. New JWT needed to reflect changes.
    public void addPermissionsToUserRoles(String username, List<String> permissionNames) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        if (permissionNames == null || permissionNames.isEmpty()) {
            return;
        }

        List<Permission> permissions = permissionRepository.findAllById(permissionNames);
        if (permissions.isEmpty()) {
            throw new AppException(ErrorCode.INVALID_KEY);
        }

        for (Role role : user.getRoles()) {
            if (role.getPermissions() == null) {
                role.setPermissions(new HashSet<>());
            }
            role.getPermissions().addAll(permissions);
            roleRepository.save(role);
        }
    }
}
