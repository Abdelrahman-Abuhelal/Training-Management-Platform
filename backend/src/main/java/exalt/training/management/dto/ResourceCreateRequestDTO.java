package exalt.training.management.dto;

import jakarta.validation.constraints.NotNull;
import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ResourceCreateRequestDTO {

    @NotNull(message = "Resource name is required")
    private String resourceName;

    private String description; // Optional description

    private String resourceType; // e.g., "link", "file"

    private byte[] resourceFile; // Optional file content

    private String resourceUrl; // Optional URL link
}
