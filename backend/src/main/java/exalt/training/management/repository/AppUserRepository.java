package exalt.training.management.repository;

import exalt.training.management.model.users.AppUser;
import exalt.training.management.model.users.AppUserRole;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AppUserRepository extends JpaRepository<AppUser, Long> {
    Boolean existsByUsername(String username);
    Optional<AppUser> findByEmail(String email);
    List<AppUser> findByEnabledTrue();

    @EntityGraph(attributePaths = "forms") // Eagerly fetch 'forms'
    Optional<AppUser> findByUsername(String username);

    Optional <List<AppUser>> findByRole(AppUserRole role);
    @Query("SELECT u FROM AppUser u WHERE u.trainee.id = :traineeId")
    Optional<AppUser> findUserByTraineeId(@Param("traineeId") Long traineeId);
    @Query("SELECT u FROM AppUser u WHERE u.trainee.id IN :traineeIds")
    List<AppUser> findUsersByTraineeIds(@Param("traineeIds") List<Long> traineeIds);
    @Query("SELECT u.id FROM AppUser u WHERE u.trainee.id IN :traineeIds")
    List<Long> findUserIdsByTraineeIds(@Param("traineeIds") List<Long> traineeIds);
    @Query("SELECT u FROM AppUser u WHERE u.supervisor.id = :supervisorId")
    Optional<AppUser> findUserBySupervisorId(@Param("supervisorId") Long supervisorId);
    @Query("SELECT u FROM AppUser u WHERE u.supervisor.id IN :supervisorIds")
    List<AppUser> findUsersBySupervisorId(@Param("supervisorIds") List<Long> supervisorIds);

    @Query("SELECT u.id FROM AppUser u WHERE u.supervisor.id IN :supervisorIds")
    List<Long> findUserIdsBySupervisorIds(@Param("supervisorIds") List<Long> supervisorIds);


    //change the sql to have only tokenType of login



}