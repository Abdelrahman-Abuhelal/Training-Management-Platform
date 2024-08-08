package exalt.training.management.repository;

import exalt.training.management.model.TraineeTask;
import exalt.training.management.model.TrainingPlan;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository

public interface TrainingPlanRepository  extends JpaRepository<TrainingPlan, Long> {
    List<TrainingPlan> findByTraineeId(Long traineeId);
}
