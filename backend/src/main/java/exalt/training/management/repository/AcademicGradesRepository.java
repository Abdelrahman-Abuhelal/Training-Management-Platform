package exalt.training.management.repository;

import exalt.training.management.model.AcademicGrades;
import exalt.training.management.model.CourseType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AcademicGradesRepository extends JpaRepository<AcademicGrades, Long> {
 Optional<List<AcademicGrades>> findByTraineeId(Long traineeId);
 Optional<AcademicGrades> findAcademicGradesByCourse_IdAndTrainee_Id(Long courseId, Long traineeId);

 void deleteAllByTrainee_Id(Long id);
}
