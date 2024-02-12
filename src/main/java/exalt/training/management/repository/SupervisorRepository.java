package exalt.training.management.repository;

import exalt.training.management.model.Supervisor;
import exalt.training.management.model.Token;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SupervisorRepository  extends JpaRepository<Supervisor, Long> {
}
