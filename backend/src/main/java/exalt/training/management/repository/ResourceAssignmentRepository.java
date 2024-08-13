package exalt.training.management.repository;

import exalt.training.management.model.Resource;
import exalt.training.management.model.ResourceAssignment;
import exalt.training.management.model.TrainingPlan;
import exalt.training.management.model.TrainingPlanAssignment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ResourceAssignmentRepository extends JpaRepository<ResourceAssignment, Long> {
    List<ResourceAssignment> findByResource(Resource resource);
    List<ResourceAssignment> findByTraineeId(Long traineeId);


}
