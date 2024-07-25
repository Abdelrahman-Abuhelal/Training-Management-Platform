package exalt.training.management.repository;

import exalt.training.management.model.Skill;
import exalt.training.management.model.TraineeSkill;
import exalt.training.management.model.users.Trainee;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface SkillRepository extends JpaRepository<Skill, Long> {

}
