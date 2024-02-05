package exalt.training.management.repository;

import exalt.training.management.model.AcademicGrades;
import exalt.training.management.model.AcademicGradesType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AcademicGradesRepository extends JpaRepository<AcademicGrades, Long> {
 boolean existsAcademicGradesByType(AcademicGradesType type);


}
