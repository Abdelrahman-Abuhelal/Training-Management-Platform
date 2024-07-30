package exalt.training.management.controller;

import exalt.training.management.model.AcademicGrades;
import exalt.training.management.service.AcademicGradesService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RequestMapping("/api/v1/academic-courses")
@RestController
@RequiredArgsConstructor
public class AcademicGradesController {

    private final AcademicGradesService academicGradesService;

    // Should add authorization to this endpoint for only SUPER_ADMIN
    @Operation(summary = "Get All Academic Grades", security = @SecurityRequirement(name = "loginAuth"))
    @PreAuthorize("hasAnyRole('SUPER_ADMIN','SUPERVISOR')")
    @GetMapping("/all")
    public ResponseEntity<List<AcademicGrades>> getAllAcademicGrades() {
        try {
            List<AcademicGrades> academicGrades = academicGradesService.getAllAcademicGrades();
            return new ResponseEntity<>(academicGrades, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PreAuthorize("hasAnyRole('SUPER_ADMIN','SUPERVISOR')")
    @GetMapping("/trainees/{userId}")
    public ResponseEntity<List<AcademicGrades>> getAcademicGradesForTrainee(@PathVariable Long userId) {
        try {
            List<AcademicGrades> academicGrades = academicGradesService.getAcademicGradesForTrainee(userId);
            return new ResponseEntity<>(academicGrades, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Operation(summary = "Save Academic Grades for a trainee using UserId", security = @SecurityRequirement(name = "loginAuth"))
    @PreAuthorize("hasAnyRole('SUPER_ADMIN','SUPERVISOR')")
    @PutMapping("/trainees/{userId}")
    public ResponseEntity<String> saveAcademicGradesToTrainee(@RequestBody Map<String, Double> grades, @PathVariable Long userId) {
        try {
            return ResponseEntity.ok(academicGradesService.saveAcademicGradesToTrainee(grades, userId));
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
