package exalt.training.management.dto;

import lombok.*;

import java.util.Set;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ResourceResponseDTO {

    private Long id;
    private String resourceName;
    private String description;
    private String resourceType;
    private String resourceUrl;
    private Long supervisorId;
    private Set<Long> traineeIds;
}
