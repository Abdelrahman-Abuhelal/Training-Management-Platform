package com.example.training.dto;


import jakarta.validation.constraints.NotEmpty;
import lombok.*;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class LoginRequestDto {

    private String username;
    private String password;


}
