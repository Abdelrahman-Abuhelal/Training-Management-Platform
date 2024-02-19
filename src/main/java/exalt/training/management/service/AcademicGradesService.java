package exalt.training.management.service;

import exalt.training.management.model.AcademicGrades;
import exalt.training.management.repository.AcademicGradesRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@Slf4j
@RequiredArgsConstructor
public class AcademicGradesService {
    private final AcademicGradesRepository academicGradesRepository;

    public void saveAcademicGrade(AcademicGrades academicGrades){
        academicGradesRepository.save(academicGrades);
    }

    public void saveAcademicGrades(List<AcademicGrades> academicGrades){
        academicGradesRepository.saveAll(academicGrades);
    }

    public List<AcademicGrades> getAllAcademicGrades() {
        return academicGradesRepository.findAll();
    }

}
