package exalt.training.management.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public  class SkillProficiencyDTO {
    private Long skillId;
    private String skillName;
    private String proficiencyLevel;
    private String topic;
}