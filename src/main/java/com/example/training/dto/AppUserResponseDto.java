package com.example.training.dto;

import com.example.training.model.AppUserRole;
import jakarta.persistence.Column;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Id;
import lombok.*;


@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class AppUserResponseDto {


    private Long userId;

    private String userUsername;

    private AppUserRole userRole;



}
