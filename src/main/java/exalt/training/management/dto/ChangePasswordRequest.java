package exalt.training.management.dto;

import exalt.training.management.config.password.StrongPassword;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ChangePasswordRequest {
    private String currentPassword;
    @StrongPassword
    private String newPassword;
    @StrongPassword
    private String confirmationPassword;
}