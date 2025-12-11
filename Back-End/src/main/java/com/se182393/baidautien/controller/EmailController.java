package com.se182393.baidautien.controller;

import com.se182393.baidautien.dto.request.ApiResponse;
import com.se182393.baidautien.dto.request.EmailOtpRequest;
import com.se182393.baidautien.service.EmailService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/email")
@RequiredArgsConstructor
public class EmailController {

    private final EmailService emailService;

    @PostMapping("/request-otp")
    public ApiResponse<String> requestEmailOtp(@RequestBody @Valid EmailOtpRequest request) {
        String result = emailService.sendOtpToEmail(request.getEmail());
        return ApiResponse.<String>builder().result(result).build();
    }
}


