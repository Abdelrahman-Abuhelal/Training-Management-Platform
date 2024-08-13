package exalt.training.management.repository;

import exalt.training.management.model.Skill;
import exalt.training.management.model.TraineeSkill;
import exalt.training.management.model.users.Trainee;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository

public interface SkillRepository extends JpaRepository<Skill, Long> {

}
