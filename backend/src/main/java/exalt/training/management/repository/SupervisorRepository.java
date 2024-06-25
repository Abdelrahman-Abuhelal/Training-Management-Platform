package exalt.training.management.repository;

import exalt.training.management.model.users.Supervisor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SupervisorRepository  extends JpaRepository<Supervisor, Long> {

    @Query("SELECT s.id FROM Supervisor s WHERE s.user.id IN :userIds")
    List<Long> findSupervisorIdsByUserIds(List<Long> userIds);
}
