package exalt.training.management.repository;

import exalt.training.management.model.DriveAccessToken;
import exalt.training.management.model.forms.Question;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DriveAccessTokenRepository extends JpaRepository<DriveAccessToken,Long> {
}
