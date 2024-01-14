package com.example.training.model;

import lombok.*;
import org.springframework.security.core.authority.SimpleGrantedAuthority;

import java.security.Permission;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;


@Getter
public enum AppUserRole {
    SUPER_ADMIN,SUPERVISOR,TRAINEE;


}
