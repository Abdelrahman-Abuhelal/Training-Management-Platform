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
public class CreatedUserResponse {

    private String message;
    @JsonProperty("confirmation_token")
    private String confirmationToken;
    @JsonProperty("refresh_token")
    private String refreshToken;
}
