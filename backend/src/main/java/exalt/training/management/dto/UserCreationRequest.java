package exalt.training.management.dto;

import exalt.training.management.model.users.AppUserRole;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class UserCreationRequest {

    @Email(message = "Please provide a valid email address")
    @NotEmpty(message = "Email should not be empty")
    private String userEmail;

    @NotEmpty(message = "Username should not be empty")
    private String userUsername;

    @NotEmpty(message = "First name should not be empty")
    private String userFirstName;

    @NotEmpty(message = "Last name should not be empty")
    private String userLastName;

    @NotEmpty(message = "User Branch should not be empty")
    private String userBranch;

    @Enumerated(EnumType.STRING)
    @NotNull(message = "Role should not be empty")
    private AppUserRole userRole;
}
