package com.example.training.dto;


import jakarta.validation.constraints.NotEmpty;
import lombok.*;

@Setter
@Getter
public class LoginRequestDto {

    private String username;
    private String password;


}
