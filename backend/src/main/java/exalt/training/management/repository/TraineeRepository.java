package exalt.training.management.repository;


import exalt.training.management.model.users.Trainee;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;


@Repository
public interface TraineeRepository extends JpaRepository<Trainee, Long> {
    @Query("SELECT s.id FROM Trainee s WHERE s.user.id IN :userIds")
    List<Long> findTraineeIdsByUserIds(List<Long> userIds);


    @Query("SELECT t FROM Trainee t JOIN FETCH t.supervisors s WHERE s.id = :supervisorId")
    List<Trainee> findBySupervisorId(Long supervisorId);

}