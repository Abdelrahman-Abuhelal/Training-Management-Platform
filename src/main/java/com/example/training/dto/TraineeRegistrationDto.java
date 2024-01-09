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

    private String username;

    private String email;

    private String password;

}
