package com.example.training.model;

import jakarta.persistence.Column;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Id;
import lombok.*;


@Getter
@Setter
public class AppUserResponseDto {


    private Long userId;

    private String userUsername;

    private AppUserRole userRole;



}
