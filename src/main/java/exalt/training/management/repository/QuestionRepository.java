package exalt.training.management.repository;

import exalt.training.management.model.forms.Question;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository

public interface QuestionRepository  extends JpaRepository<Question,Long> {
}
