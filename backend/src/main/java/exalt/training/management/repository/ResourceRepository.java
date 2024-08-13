package exalt.training.management.repository;

import exalt.training.management.model.Resource;
import exalt.training.management.model.Skill;
import exalt.training.management.model.TrainingPlan;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ResourceRepository extends JpaRepository<Resource, Long> {
    List<Resource> findBySupervisorId(Long supervisorId); // Custom query method
}
