package exalt.training.management.repository;

import exalt.training.management.model.AcademicGrades;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AcademicGradesRepository extends JpaRepository<AcademicGrades, Long> {


}
