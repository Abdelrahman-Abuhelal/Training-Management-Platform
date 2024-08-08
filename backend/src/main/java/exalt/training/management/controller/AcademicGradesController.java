package exalt.training.management.controller;

import exalt.training.management.model.AcademicGrades;
import exalt.training.management.service.AcademicGradesService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
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

    private static final Logger log = LoggerFactory.getLogger(AcademicGradesController.class);
    private final AcademicGradesService academicGradesService;

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
    @Operation(summary = "Get Academic Grades for a trainee using UserId", security = @SecurityRequirement(name = "loginAuth"))
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

            return ResponseEntity.ok(academicGradesService.saveAcademicGradesToTrainee(grades, userId));

    }
}
