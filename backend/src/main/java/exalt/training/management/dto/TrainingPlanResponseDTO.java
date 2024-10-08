package exalt.training.management.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Set;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TrainingPlanResponseDTO {
    private Long id;
    private String fileName;
    private Long supervisorId;
    private Set<Long> traineeIds;
    private byte[] planFile;
}
