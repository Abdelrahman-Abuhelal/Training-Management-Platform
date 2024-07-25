package exalt.training.management.service;

import exalt.training.management.dto.FormSubmissionDto;
import exalt.training.management.dto.SkillDto;
import exalt.training.management.model.Skill;
import exalt.training.management.model.forms.FormSubmission;
import exalt.training.management.repository.SkillRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SkillService {

    private final SkillRepository skillRepository;

    public SkillService(SkillRepository skillRepository) {
        this.skillRepository = skillRepository;
    }

    public List<Skill> getAllSkills() {
        return skillRepository.findAll();
    }

    public String addSkill(SkillDto skillDto) {
        Skill skill= toEntity(skillDto);
        skillRepository.save(skill);
        return "skill has been added";
    }

    public String deleteSkill(Long id) {
        skillRepository.deleteById(id);
        return "skill has been deleted";
    }

    private Skill toEntity(SkillDto skillDto) {
        Skill skill = new Skill();
        skill.setName(skillDto.getName());
        skill.setTopic(skillDto.getTopic());
        return skill;
    }
}
