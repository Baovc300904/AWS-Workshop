package com.se182393.baidautien.validator;


import jakarta.validation.Constraint;
import jakarta.validation.Payload;
import jakarta.validation.constraints.Size;

import java.lang.annotation.Documented;
import java.lang.annotation.Repeatable;
import java.lang.annotation.Retention;
import java.lang.annotation.Target;

import static java.lang.annotation.ElementType.*;
import static java.lang.annotation.ElementType.TYPE_USE;
import static java.lang.annotation.RetentionPolicy.RUNTIME;

//class nay de custom validation theo y cua minh,ví dụ như là muốn dob >=18
//3 cái annotation dưới lấy từ click chuột @Size ra

@Target({FIELD})
@Retention(RUNTIME)
@Constraint(validatedBy = { DobValidator.class})
public @interface DobConstraint {

    String message() default "{Invalid date of birth}";

    int min();


    Class<?>[] groups() default { };

    Class<? extends Payload>[] payload() default { };
}
