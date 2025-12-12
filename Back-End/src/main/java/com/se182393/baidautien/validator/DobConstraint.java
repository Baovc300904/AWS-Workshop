package com.se182393.baidautien.validator;


import static java.lang.annotation.ElementType.FIELD;
import java.lang.annotation.Retention;
import static java.lang.annotation.RetentionPolicy.RUNTIME;
import java.lang.annotation.Target;

import jakarta.validation.Constraint;
import jakarta.validation.Payload;

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
