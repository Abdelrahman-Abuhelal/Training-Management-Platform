package exalt.training.management.repository;

import exalt.training.management.model.AppUser;
import exalt.training.management.model.AppUserRole;
import exalt.training.management.model.Token;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AppUserRepository extends JpaRepository<AppUser, Long> {
    Boolean existsByUsername(String username);
    Optional<AppUser> findByEmail(String email);

    Optional <List<AppUser>> findByRole(AppUserRole role);

    //change the sql to have only tokenType of login



}