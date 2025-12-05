package com.se182393.baidautien.validator;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.Objects;


//LocalDate do biến dữ liệu bên updateUser là LocalDate, còn DobConstraiint là cái class muốn xác thực



public class DobValidator implements ConstraintValidator<DobConstraint, LocalDate> {

    private int min;

    @Override
    public void initialize(DobConstraint constraintAnnotation) {
        ConstraintValidator.super.initialize(constraintAnnotation);
        min = constraintAnnotation.min();
    }

    @Override
    public boolean isValid(LocalDate value, ConstraintValidatorContext context) {

        // cái này vẫn cho phép null, nếu không muoons null thì phải thêm annotation  @NotNull trong fields
        if(Objects.isNull(value)){
            return true;
        }

       long years = ChronoUnit.YEARS.between(value,LocalDate.now());

        return years >= min;
    }
}
