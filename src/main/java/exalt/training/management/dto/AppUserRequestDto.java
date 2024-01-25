package exalt.training.management.dto;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import exalt.training.management.model.*;
import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;


@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class AppUserRequestDto {

    private String email;

    private String username;

    @Enumerated(EnumType.STRING)
    private AppUserRole role;

    @Size(max = 50)
    private String firstName;

    @Size(max = 50)
    private String lastName;

    @Size(max = 50)
    private String fullName;

    @Size(max = 256)
    private String imageUrl;


    private Boolean enabled;


}
