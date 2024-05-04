package exalt.training.management.repository;

import exalt.training.management.model.users.Supervisor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SupervisorRepository  extends JpaRepository<Supervisor, Long> {
}
