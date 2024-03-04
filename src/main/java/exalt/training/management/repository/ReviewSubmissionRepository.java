package exalt.training.management.repository;

import exalt.training.management.model.forms.ReviewSubmission;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ReviewSubmissionRepository extends JpaRepository<ReviewSubmission,Long> {
}
