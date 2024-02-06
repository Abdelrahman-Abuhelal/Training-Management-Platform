package exalt.training.management.repository;

import exalt.training.management.model.AcademicGrades;
import exalt.training.management.model.CourseType;
import exalt.training.management.model.Trainee;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface AcademicGradesRepository extends JpaRepository<AcademicGrades, Long> {
 boolean existsAcademicGradesByType(CourseType type);
 Optional<AcademicGrades> findAcademicGradesByTypeAndTrainee_Id(CourseType courseType, Long id);

}
