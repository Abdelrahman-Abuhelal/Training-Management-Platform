package exalt.training.management.config.password;

import exalt.training.management.config.password.PasswordValidator;
import jakarta.validation.Constraint;
import jakarta.validation.Payload;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

@Target({ElementType.FIELD, ElementType.METHOD})
@Retention(RetentionPolicy.RUNTIME)
@Constraint(validatedBy = PasswordValidator.class)
public @interface StrongPassword {
    String message() default "Password require a mix of uppercase and lowercase letters, numbers, and special characters";

    Class<?>[] groups() default {};

    Class<? extends Payload>[] payload() default {};
}
