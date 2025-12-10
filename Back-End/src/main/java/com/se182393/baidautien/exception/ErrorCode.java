package com.se182393.baidautien.exception;

import lombok.Getter;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;

@Getter
public enum ErrorCode {
    UNCATEGORIZED_EXCEPTION(9999,"Uncategorized Exception", HttpStatus.INTERNAL_SERVER_ERROR),
    INVALID_KEY(1001,"Invalid message key", HttpStatus.BAD_REQUEST),
    USER_EXISTED(1002,"User existed", HttpStatus.BAD_REQUEST),
    USERNAME_INVALID(1003,"Username must be at least 3 characters", HttpStatus.BAD_REQUEST),
    INVALID_PASSWORD(1004,"Password must be at least 6 characters", HttpStatus.BAD_REQUEST),
    USER_NOT_EXISTED(1005,"User not existed",HttpStatus.NOT_FOUND),
    UNAUTHENTICATED(1006,"Unauthenticated",HttpStatus.UNAUTHORIZED),
    UNAUTHORIZED(1007,"You do not have permission",HttpStatus.FORBIDDEN),

    // kĩ thuật nâng cao của validation theo dob mà không cần sửa mess
    INVALID_DOB(1008,"Your age must be at least {min}",HttpStatus.BAD_REQUEST),
    PRODUCT_NOT_EXISTED(1009,"Product not existed",HttpStatus.NOT_FOUND),
    PRODUCT_NAME_INVALID(1010,"Product must be at least 10 characters", HttpStatus.BAD_REQUEST),
    CATEGORY_NOT_EXISTED(1011,"Category not existed",HttpStatus.NOT_FOUND),
    NO_GAMES_FOUND(1012, "No games found", HttpStatus.NOT_FOUND),
    INVALID_PHONE(1013, "Invalid phone number", HttpStatus.BAD_REQUEST),
    PHONE_OTP_NOT_REQUESTED(1015, "Phone OTP not requested", HttpStatus.BAD_REQUEST),
    PHONE_OTP_INVALID(1016, "Phone OTP invalid", HttpStatus.BAD_REQUEST),
    PHONE_OTP_EXPIRED(1017, "Phone OTP expired", HttpStatus.BAD_REQUEST),
    PASSWORD_RESET_USER_NOT_FOUND(1100, "User not found for password reset", HttpStatus.NOT_FOUND),
    PASSWORD_RESET_TOKEN_INVALID(1101, "Password reset token is invalid", HttpStatus.BAD_REQUEST),
    PASSWORD_RESET_TOKEN_EXPIRED(1102, "Password reset token is expired", HttpStatus.BAD_REQUEST),
    PASSWORD_RESET_TOKEN_USED(1103, "Password reset token already used", HttpStatus.BAD_REQUEST),
    ROLE_NOT_EXISTED(1104, "Role not existed", HttpStatus.NOT_FOUND),

    ;
    private int code;
    private String message;
    private HttpStatusCode statusCode;

    ErrorCode(int code, String message,HttpStatusCode statusCode) {
        this.code = code;
        this.message = message;
        this.statusCode = statusCode;
    }


}
