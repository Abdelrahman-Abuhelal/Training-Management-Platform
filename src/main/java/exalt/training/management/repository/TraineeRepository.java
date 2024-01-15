package exalt.training.management.repository;


import exalt.training.management.model.AppUser;
import exalt.training.management.model.AppUserRole;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;


@Repository
public interface TraineeRepository extends JpaRepository<AppUser, Long> {

    Optional <List<AppUser>> findByRole(AppUserRole role);
    Optional<AppUser> findByEmail(String email);

}