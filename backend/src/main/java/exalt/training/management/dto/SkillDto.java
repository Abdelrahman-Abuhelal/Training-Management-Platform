package exalt.training.management.dto;

import exalt.training.management.model.Skill;
import exalt.training.management.model.SkillTopic;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class SkillDto {

    private String name;

    private SkillTopic topic;

}
