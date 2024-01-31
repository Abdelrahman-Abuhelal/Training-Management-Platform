package exalt.training.management.controller;

import exalt.training.management.model.AcademicGrades;
import exalt.training.management.service.AcademicGradesService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/admin")
public class AcademicGradesController {

    private final AcademicGradesService academicGradesService;




}
