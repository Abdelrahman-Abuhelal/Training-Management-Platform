package exalt.training.management.repository;

import exalt.training.management.model.TraineeTask;
import exalt.training.management.model.users.Trainee;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TraineeTaskRepository extends JpaRepository<TraineeTask, Long> {
    List<TraineeTask> findByTaskId(Long taskId);
    List<TraineeTask> findAllByTrainee(Trainee trainee);
}
