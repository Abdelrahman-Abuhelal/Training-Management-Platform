package exalt.training.management.model.users;


import exalt.training.management.model.Permission;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;

import java.util.Collection;
import java.util.Collections;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import static exalt.training.management.model.Permission.*;

@RequiredArgsConstructor
@Getter
public enum AppUserRole {

    SUPER_ADMIN(Set.of(ADMIN_READ,ADMIN_UPDATE,ADMIN_CREATE,ADMIN_DELETE)),

    SUPERVISOR(Set.of(ADMIN_CREATE,ADMIN_READ)),

    TRAINEE(Collections.emptySet());


 private final Set<Permission> permissions;

 public List<SimpleGrantedAuthority> getAuthorities(){

     var authorities = getPermissions().stream().map(permission -> new SimpleGrantedAuthority(permission.getPermission()))
             .collect(Collectors.toList());

     authorities.add(new SimpleGrantedAuthority("ROLE_"+this.name()));
     return authorities;
 }
}