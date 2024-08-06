package exalt.training.management.repository;

import exalt.training.management.model.Task;
import exalt.training.management.model.users.Supervisor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TaskRepository extends JpaRepository<Task, Long>{
    List<Task> findAllByAssignedBy(Supervisor supervisor);

}
