package exalt.training.management.dto;

import lombok.Builder;
import lombok.Data;

import java.util.Set;

@Data
@Builder
public class TrainingPlanResponseDTO {
    private Long id;
    private String fileName;
    private Long supervisorId;
    private Set<Long> traineeIds;
    private byte[] planFile;
}
