package exalt.training.management.repository;

import exalt.training.management.model.TraineeSkill;
import exalt.training.management.model.users.Trainee;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import javax.swing.text.html.Option;
import java.util.List;
import java.util.Optional;
@Repository

public interface TraineeSkillRepository extends JpaRepository<TraineeSkill, Long> {

    List<TraineeSkill> findByTrainee(Trainee trainee);
    void deleteByTrainee(Trainee trainee);
    Optional<TraineeSkill> findByTraineeAndSkillId(Trainee trainee, Long skillId);

}
