package exalt.training.management.model;


import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum Permission {

    //here add the needed permissions
ADMIN_READ("admin:read"),
    ADMIN_UPDATE("admin:update"),
    ADMIN_DELETE("admin:delete"),
    ADMIN_CREATE("admin:create"),
    SUPERVISOR_READ("supervisor:read"),
    SUPERVISOR_UPDATE("supervisor:update"),
    SUPERVISOR_DELETE("supervisor:delete"),
    SUPERVISOR_CREATE("supervisor:create")
    ;

    private final String permission;
}
