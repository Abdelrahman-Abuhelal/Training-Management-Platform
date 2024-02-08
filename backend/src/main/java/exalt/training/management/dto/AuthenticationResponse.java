package exalt.training.management.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class AuthenticationResponse {

    private AppUserDto appUserDto;
    @JsonProperty("login_token")
    private String loginToken;
    @JsonProperty("refresh_token")
    private String refreshToken;
}