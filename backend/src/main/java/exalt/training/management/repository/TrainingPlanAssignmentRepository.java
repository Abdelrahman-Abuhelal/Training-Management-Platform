package exalt.training.management.repository;

import exalt.training.management.model.TrainingPlan;
import exalt.training.management.model.TrainingPlanAssignment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
@Repository

public interface TrainingPlanAssignmentRepository extends JpaRepository<TrainingPlanAssignment, Long> {
   List<TrainingPlanAssignment> findByTrainingPlan(TrainingPlan trainingPlan);
   List<TrainingPlanAssignment> findByTraineeId(Long traineeId);

}
