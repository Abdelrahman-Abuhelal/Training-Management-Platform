package exalt.training.management.repository;

import exalt.training.management.model.AcademicGrades;
import exalt.training.management.model.CourseType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AcademicGradesRepository extends JpaRepository<AcademicGrades, Long> {
 boolean existsAcademicGradesByType(CourseType type);
 Optional<AcademicGrades> findAcademicGradesByTypeAndTrainee_Id(CourseType courseType, Long id);
 Optional<List<AcademicGrades>> findAllByTrainee_Id(Long id);

 void deleteAllByTrainee_Id(Long id);
}
