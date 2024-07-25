package exalt.training.management.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class TraineeSkillsResponseDTO {
    private Long userId;
    private String traineeName;
    private List<SkillProficiencyDTO> skills;
}