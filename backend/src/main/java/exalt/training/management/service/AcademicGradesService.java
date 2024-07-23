package exalt.training.management.service;

import exalt.training.management.exception.AcademicGradesNotFoundException;
import exalt.training.management.exception.AppUserNotFoundException;
import exalt.training.management.exception.InvalidAcademicCourseException;
import exalt.training.management.model.AcademicGrades;
import exalt.training.management.model.CourseType;
import exalt.training.management.model.users.AppUser;
import exalt.training.management.model.users.Trainee;
import exalt.training.management.repository.AcademicGradesRepository;
import exalt.training.management.repository.AppUserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
@Slf4j
@RequiredArgsConstructor
public class AcademicGradesService {
    private final AcademicGradesRepository academicGradesRepository;
    private final AppUserRepository appUserRepository;
    private final EnumSet<CourseType> validCourseTypes = EnumSet.allOf(CourseType.class);

    public void saveAcademicGrade(AcademicGrades academicGrades){
        academicGradesRepository.save(academicGrades);
    }

    public void saveAcademicGrades(List<AcademicGrades> academicGrades){
        academicGradesRepository.saveAll(academicGrades);
    }

    public List<AcademicGrades> getAllAcademicGrades() {
        return academicGradesRepository.findAll();
    }
    @Transactional
    public String saveAcademicGradesToTrainee(Map<String, Double> grades, Long userId) {
        AppUser appUser = appUserRepository.findById(userId).orElseThrow(()-> new AppUserNotFoundException("There is no user with this ID: "+ userId));
        Trainee trainee = appUser.getTrainee();
        if (trainee == null) {
            throw new AppUserNotFoundException("User is not a Trainee");
        }
        log.info("grades size: {}",grades.size());
        // Uppercase the keys before validation
        Set<String> uppercaseKeys = grades.keySet().stream().map(String::toUpperCase).collect(Collectors.toSet());
        try {
            if (!uppercaseKeys.stream().allMatch(key -> validCourseTypes.contains(CourseType.valueOf(key)))) {
                throw new InvalidAcademicCourseException("Invalid course types found in academicGradesDto");
            }
        }catch (IllegalArgumentException e){
            throw new InvalidAcademicCourseException("Invalid course type found in academicGradesDto");
        }
        academicGradesRepository.deleteAllByTrainee_Id(trainee.getId());
        Set <AcademicGrades> academicGradesSet = new HashSet<>();
        for (Map.Entry<String, Double> entry : grades.entrySet()) {
            String key = entry.getKey();
            Double mark = entry.getValue();
            try {
                // Check for existing grade with the same courseType and trainee
                CourseType courseType = CourseType.valueOf(key.toUpperCase());

                Optional<AcademicGrades> existingGrade = academicGradesRepository.findAcademicGradesByTypeAndTrainee_Id(courseType, trainee.getId());

                if (existingGrade.isPresent()) {
                    existingGrade.get().setMark(mark);
                    academicGradesSet.add(existingGrade.get());
                } else {
                    // Create new grade
                    AcademicGrades newGrade = new AcademicGrades(courseType, mark, trainee);
                    academicGradesSet.add(newGrade);
                }
            } catch (InvalidAcademicCourseException e) {
                throw new InvalidAcademicCourseException("Invalid Course type : " + key);
            }
        }
        academicGradesRepository.saveAll(academicGradesSet);
        trainee.setAcademicGrades(academicGradesSet);
        return "Academic Grades Registered Successfully";
    }

    public List<AcademicGrades> getAcademicGradesForTrainee(Long userId) {
        AppUser appUser = appUserRepository.findById(userId).orElseThrow(()-> new AppUserNotFoundException("There is no user with this ID: "+ userId));
        Trainee trainee = appUser.getTrainee();
        if (trainee == null) {
            throw new AppUserNotFoundException("User is not a Trainee");
        }
        return academicGradesRepository.findByTraineeId(trainee.getId()).orElseThrow(()-> new AcademicGradesNotFoundException("There are no academic grades for this trainee"));

    }

}
