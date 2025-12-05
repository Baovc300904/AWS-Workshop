package com.se182393.baidautien.exception;

//class nay la de bat loi theo code voi y cua minh, no se dua vao Errorcode
//tại sao phải có AppException tại vì nếu không có nó thì gọi Errorcode bên service sẽ chỉ có dòng message String thôi
public class AppException extends RuntimeException {

    public AppException(ErrorCode errorCode) {
        super(errorCode.getMessage());
        this.errorCode = errorCode;
    }

    private ErrorCode errorCode;

    public ErrorCode getErrorCode() {
        return errorCode;
    }

    public void setErrorCode(ErrorCode errorCode) {
        this.errorCode = errorCode;
    }
}
