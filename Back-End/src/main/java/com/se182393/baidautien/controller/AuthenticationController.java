package com.se182393.baidautien.controller;


import java.text.ParseException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.nimbusds.jose.JOSEException;
import com.se182393.baidautien.dto.request.ApiResponse;
import com.se182393.baidautien.dto.request.AuthenticationRequest;
import com.se182393.baidautien.dto.request.IntrospectRequest;
import com.se182393.baidautien.dto.request.LogoutRequest;
import com.se182393.baidautien.dto.request.RefreshRequest;
import com.se182393.baidautien.dto.response.AuthenticationResponse;
import com.se182393.baidautien.dto.response.IntrospectResponse;
import com.se182393.baidautien.service.AuthenticationService;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@CrossOrigin(origins = {"https://keygamezspace.space", "http://localhost:5173"}, allowCredentials = "true")
public class AuthenticationController {

    @Autowired
    AuthenticationService authenticationService;

    @PostMapping("/login")
    ApiResponse<AuthenticationResponse> authenticate(@RequestBody  AuthenticationRequest request)  {
       var result = authenticationService.authenticated(request);
       return ApiResponse.<AuthenticationResponse>builder()
               .result(result)
               .build();
    }


    @PostMapping("/introspect")
    ApiResponse<IntrospectResponse> authenticate(@RequestBody IntrospectRequest request) throws ParseException, JOSEException {
        var result = authenticationService.introspect(request);
        return ApiResponse.<IntrospectResponse>builder()
                .result(result)
                .build();
    }


    @PostMapping("/logout")
    ApiResponse<Void> logout(@RequestBody LogoutRequest request) throws ParseException, JOSEException {
        authenticationService.logout(request);
        return ApiResponse.<Void>builder()
                .build();
    }

    @PostMapping("/refresh")
    ApiResponse<AuthenticationResponse> logout(@RequestBody RefreshRequest request) throws ParseException, JOSEException {
        var result = authenticationService.refreshTokenn(request);
        return ApiResponse.<AuthenticationResponse>builder()
                .result(result)
                .build();
    }
}
