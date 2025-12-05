package com.se182393.baidautien.exception;


import com.se182393.baidautien.dto.request.ApiResponse;
import jakarta.validation.ConstraintViolation;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import java.util.HashMap;
import java.util.Map;
import java.util.Objects;

@ControllerAdvice
@Slf4j
public class GlobalExceptionHandler {


    private static final String MIN_ATTRIBUTE = "min";

    //cai nay phai thay doi o cai value voi cai parameter theo cai loi
    @ExceptionHandler(value = Exception.class)
    ResponseEntity<ApiResponse> handlingAppException(Exception exception){
        log.error("Uncategorized exception occurred", exception);
        ApiResponse apiResponse = new ApiResponse();
        apiResponse.setCode(ErrorCode.UNCATEGORIZED_EXCEPTION.getCode());
        apiResponse.setMessage(ErrorCode.UNCATEGORIZED_EXCEPTION.getMessage() + ": " + exception.getMessage());
        return ResponseEntity.badRequest().body(apiResponse);
    }

    //phai có cái này thì mình mới tự chơi đc AppExxception của riêng
    @ExceptionHandler(value = AppException.class)
    ResponseEntity<ApiResponse> handlingAppException(AppException exception){
        ErrorCode errorCode = exception.getErrorCode();
        ApiResponse apiResponse = new ApiResponse();
        apiResponse.setCode(errorCode.getCode());
        apiResponse.setMessage(errorCode.getMessage());
        return ResponseEntity
                .status(errorCode.getStatusCode())
                .body(apiResponse);
    }

 //cái này là để trả ra lỗi không đúng quyền hạn theo cú pháp apiressponse
@ExceptionHandler(value = AccessDeniedException.class)
ResponseEntity<ApiResponse> handlingAccessDeniedException(AccessDeniedException exception){
        ApiResponse apiResponse = new ApiResponse();
        ErrorCode errorCode = ErrorCode.UNAUTHORIZED;
        apiResponse.setCode(errorCode.getCode());
        apiResponse.setMessage(errorCode.getMessage());

        return ResponseEntity
                .status(errorCode.getStatusCode())
                .body(apiResponse);
}





    //cai nay xai chung voi SpringValidation
    //giải thích cái Errorcode,INvalid (khi mà bên cái SpringValidation mà truyền sai tên thì mới ra cái đó)
    //tại sao phải có enumKey ( bởi vì nếu không có cái đó sẽ bị vi phạm quy ước của Convention over configuration của java) (coi lại bên dto coi mapping enum ErrorCode vô sao)

    @ExceptionHandler(value = MethodArgumentNotValidException.class)
    ResponseEntity<ApiResponse> handlingValidException(MethodArgumentNotValidException exception){
        //dòng này sẽ lấy message của field khác khi sai lỗi, nhma atribbute không phải annotation như min max đồ
        String enumKey = exception.getFieldError().getDefaultMessage();

        ErrorCode errorCode = ErrorCode.INVALID_KEY;
        Map<String,Object> attributes = null;
        
        try {
            errorCode= ErrorCode.valueOf(enumKey);

            // kĩ thuật nâng cao để validation cái dob theo cái min mà không cần thay đổi message, ví dụ mỗi lần thay dob min 16 thì mess tự thay = 16

            var constrainViolation = exception.getBindingResult().getAllErrors().get(0).unwrap(ConstraintViolation.class);

            attributes =  constrainViolation.getConstraintDescriptor().getAttributes();

           log.info(attributes.toString());
        }catch (IllegalArgumentException e){

        }

        ApiResponse apiResponse = new ApiResponse();




        apiResponse.setCode(errorCode.getCode());

        // khúc này nâng cao của validation theo dob
        apiResponse.setMessage(Objects.nonNull(attributes) ?
                mapAttribute(errorCode.getMessage(), attributes)
               : errorCode .getMessage());

        return ResponseEntity.badRequest().body(apiResponse);
    }


    // kĩ thuật nâng cao để validation cái dob theo cái min mà không cần thay đổi message, ví dụ mỗi lần thay dob min 16 thì mess tự thay = 16
    private String mapAttribute(String message, Map<String,Object> attributes){
        String minValue = String.valueOf(attributes.get(MIN_ATTRIBUTE)) ;

        return message.replace("{"+ MIN_ATTRIBUTE +"}",minValue);
    }
}
