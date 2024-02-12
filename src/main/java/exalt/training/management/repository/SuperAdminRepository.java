package exalt.training.management.repository;

import exalt.training.management.model.SuperAdmin;
import exalt.training.management.model.Supervisor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SuperAdminRepository extends JpaRepository<SuperAdmin, Long> {
}
