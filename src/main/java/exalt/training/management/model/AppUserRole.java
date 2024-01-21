package exalt.training.management.model;


import lombok.RequiredArgsConstructor;
import org.springframework.security.core.authority.SimpleGrantedAuthority;

import java.security.Permission;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@RequiredArgsConstructor
public enum AppUserRole {
    SUPER_ADMIN,SUPERVISOR,TRAINEE;



}