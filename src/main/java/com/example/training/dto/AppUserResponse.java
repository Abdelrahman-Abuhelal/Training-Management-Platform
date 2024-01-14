package com.example.training.dto;

import com.example.training.model.AppUserRole;
import lombok.*;


@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class AppUserResponse {


    private Long userId;

    private String userEmail;

    private AppUserRole userRole;



}