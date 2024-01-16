package exalt.training.management.dto;


import exalt.training.management.config.password.StrongPassword;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotEmpty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ForgotPasswordRequest {
    @StrongPassword
    private String newPassword;
    @StrongPassword
    private String confirmationPassword;
}
