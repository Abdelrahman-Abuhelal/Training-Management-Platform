package exalt.training.management.repository;

import exalt.training.management.model.Comment;
import exalt.training.management.model.Course;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository

public interface CourseRepository extends JpaRepository<Course, Long> {
    Optional<Course> findByName(String name);
}
