package exalt.training.management.dto;


import jakarta.validation.constraints.NotEmpty;
import lombok.*;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ResourceAssignRequestDTO {

    @NotEmpty(message = "User IDs are required")
    private List<Long> userIds; // List of trainee IDs to assign the resource
}
