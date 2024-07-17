package exalt.training.management.repository;

import exalt.training.management.model.forms.FormSubmission;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FormSubmissionRepository extends JpaRepository<FormSubmission,Long> {
    List<FormSubmission> findByFormId(Long formId);
}
