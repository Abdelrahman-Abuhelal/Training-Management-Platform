package exalt.training.management.controller;

import exalt.training.management.dto.CourseDto;
import exalt.training.management.model.Course;
import exalt.training.management.service.CourseService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/courses")
@RequiredArgsConstructor
public class CourseController {

    @Autowired
    private CourseService courseService;

    @PostMapping
    @PreAuthorize("hasAnyRole('SUPER_ADMIN')")
    @Operation(summary = "Create New Course (Admin Only)" , security =  @SecurityRequirement(name = "loginAuth"))
    public ResponseEntity<Course> createCourse(@RequestBody CourseDto courseDto) {
        Course course = courseService.createCourse(courseDto.getName());
        return ResponseEntity.ok(course);
    }

    // Endpoint to get all courses
    @GetMapping
    @PreAuthorize("hasAnyRole('SUPER_ADMIN','SUPERVISOR')")
    @Operation(summary = "Get All Courses" , security =  @SecurityRequirement(name = "loginAuth"))
    public ResponseEntity<List<Course>> getAllCourses() {
        List<Course> courses = courseService.getAllCourses();
        return ResponseEntity.ok(courses);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN')")
    @Operation(summary = "Delete Course (Admin Only)" , security =  @SecurityRequirement(name = "loginAuth"))
    public ResponseEntity<Void> deleteCourse(@PathVariable Long id) {
        courseService.deleteCourse(id);
        return ResponseEntity.noContent().build();
    }
}
