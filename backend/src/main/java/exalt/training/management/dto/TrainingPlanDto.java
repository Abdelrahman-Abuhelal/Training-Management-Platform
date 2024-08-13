package exalt.training.management.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TrainingPlanDto {
    private Long id;
    private String fileName;
    private byte[] planFile;
    private Long  SupervisorId;

}
