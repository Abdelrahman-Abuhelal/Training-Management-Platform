package exalt.training.management.repository;


import exalt.training.management.model.users.Trainee;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;


@Repository
public interface TraineeRepository extends JpaRepository<Trainee, Long> {
    @Query("SELECT s.id FROM Trainee s WHERE s.user.id IN :userIds")
    List<Long> findTraineeIdsByUserIds(List<Long> userIds);


    @Query("SELECT t FROM Trainee t JOIN FETCH t.supervisors s WHERE s.id = :supervisorId")
    List<Trainee> findBySupervisorId(Long supervisorId);


    @Query("SELECT t FROM Trainee t JOIN FETCH t.supervisors WHERE t.id = :traineeId")
    Optional<Trainee> findTraineeWithSupervisorsById(@Param("traineeId") Long traineeId);


    @Query("SELECT t FROM Trainee t WHERE t.user.id IN :userIds")
    Optional<List<Trainee>> findTraineesByUserIds(@Param("userIds") List<Long> userIds);

    @Query("SELECT t FROM Trainee t WHERE t.user.id = :userId")
    Optional<Trainee> findTraineeByUserId(@Param("userId") Long userId);
}