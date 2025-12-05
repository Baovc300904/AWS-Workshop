package com.se182393.baidautien.configuration;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.se182393.baidautien.dto.request.ApiResponse;
import com.se182393.baidautien.exception.ErrorCode;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.MediaType;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;

import java.io.IOException;

public class JwtAuthenticationEntryPoint implements AuthenticationEntryPoint {



    //cái này là để bắt lỗi với trả về code theo apiresponse của lỗi token giả mạo hoặc là không đúng, không bắt được ở trong GlobalExceptionHanlder đâu nhé(lỗi này đặc biệt)
    @Override
    public void commence(HttpServletRequest request, HttpServletResponse response, AuthenticationException authException) throws IOException, ServletException {
        ErrorCode errorCode = ErrorCode.UNAUTHENTICATED;
        response.setStatus(errorCode.getStatusCode().value());
        response.setContentType(MediaType.APPLICATION_JSON_VALUE);

        //tại sao ở đây phải có ? tại ở đây dữ liệu này không biết builder trả về gì nên class này nó sẽ cảnh báo
        ApiResponse<?> apiResponse = ApiResponse.builder()
                .code(errorCode.getCode())
                .message(errorCode.getMessage())
                .build();


        ObjectMapper objectMapper = new ObjectMapper();
        response.getWriter().write(objectMapper.writeValueAsString(apiResponse));
        response.flushBuffer();
    }
}
