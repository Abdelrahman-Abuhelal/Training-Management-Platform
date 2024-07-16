package exalt.training.management.repository;

import exalt.training.management.model.forms.UserFormStatus;
import exalt.training.management.model.users.AppUser;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UserFormStatusRepository extends JpaRepository<UserFormStatus, Long> {
    List<UserFormStatus> findByUser(AppUser user);
}
