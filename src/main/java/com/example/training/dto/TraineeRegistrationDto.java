package com.example.training.dto;


import com.example.training.model.AppUserRole;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.validation.constraints.NotEmpty;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class TraineeRegistrationDto {

    @NotEmpty(message = "Email should not be empty")
    private String username;

    @NotEmpty(message = "Password should not be empty")
    private String password;

    @NotEmpty
    private String firstName;


}
