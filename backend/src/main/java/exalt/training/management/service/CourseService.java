package exalt.training.management.service;

import exalt.training.management.model.Course;
import exalt.training.management.repository.CourseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CourseService {

    @Autowired
    private CourseRepository courseRepository;

    public Course createCourse(String name) {
        Course course = new Course();
        course.setName(name);
        return courseRepository.save(course);
    }

    public List<Course> getAllCourses() {
        return courseRepository.findAll();
    }

    public void deleteCourse(Long courseId) {
        courseRepository.findById(courseId).orElseThrow(() -> new RuntimeException("Course not found"));
        courseRepository.deleteById(courseId);
    }
}
