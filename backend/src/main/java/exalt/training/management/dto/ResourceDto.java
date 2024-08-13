package exalt.training.management.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ResourceDto {
    private Long id; // Resource ID
    private String resourceName; // Name of the resource
    private String description; // Description of the resource (optional)
    private String resourceType; // Type of resource (e.g., "link", "file")
    private String resourceUrl; // URL of the resource (if applicable)
    private byte[] resourceFile; // File content (if applicable)
    private Long supervisorId; // ID of the supervisor who created the resource
}
