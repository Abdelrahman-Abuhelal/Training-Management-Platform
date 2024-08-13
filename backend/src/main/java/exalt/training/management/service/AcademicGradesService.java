package exalt.training.management.service;

import exalt.training.management.exception.AcademicGradesNotFoundException;
import exalt.training.management.exception.AppUserNotFoundException;
import exalt.training.management.exception.InvalidAcademicCourseException;
import exalt.training.management.exception.InvalidUserException;
import exalt.training.management.model.AcademicGrades;
import exalt.training.management.model.Course;
import exalt.training.management.model.users.AppUser;
import exalt.training.management.model.users.Trainee;
import exalt.training.management.repository.AcademicGradesRepository;
import exalt.training.management.repository.AppUserRepository;
import exalt.training.management.repository.CourseRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
@Slf4j
public class AcademicGradesService {
    private final AcademicGradesRepository academicGradesRepository;
    private final AppUserRepository appUserRepository;
    private final CourseRepository courseRepository;

    @Autowired
    public AcademicGradesService(AcademicGradesRepository academicGradesRepository, AppUserRepository appUserRepository, CourseRepository courseRepository) {
        this.academicGradesRepository = academicGradesRepository;
        this.appUserRepository = appUserRepository;
        this.courseRepository = courseRepository;
    }

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
        AppUser appUser = appUserRepository.findById(userId)
                .orElseThrow(() -> new AppUserNotFoundException("There is no user with this ID: " + userId));
        Trainee trainee = appUser.getTrainee();
        if (trainee == null) {
            throw new AppUserNotFoundException("User is not a Trainee");
        }
        log.info("grades size: {}", grades.size());
        log.info("grades : {}", grades);

        Set<AcademicGrades> academicGradesSet = new HashSet<>();

        for (Map.Entry<String, Double> entry : grades.entrySet()) {
            String courseName = entry.getKey();
            Double mark = entry.getValue();

            Course course = courseRepository.findByName(courseName)
                    .orElseThrow(() -> new InvalidAcademicCourseException("Invalid course name: " + courseName));

            // Create new grade
            AcademicGrades newGrade = new AcademicGrades(course, mark, trainee);
            academicGradesSet.add(newGrade);
        }

        // Delete existing grades for the trainee before saving new ones
        academicGradesRepository.deleteAllByTrainee_Id(trainee.getId());

        // Save all new grades
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
    public List<AcademicGrades> getMyAcademicGrades() {
    Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
    var user = (AppUser) authentication.getPrincipal();
    var trainee = user.getTrainee();
        if(trainee == null){
        throw new InvalidUserException("User is not a Trainee" );
    }
        return academicGradesRepository.findByTraineeId(trainee.getId()).orElseThrow(()-> new AcademicGradesNotFoundException("There are no academic grades for this trainee"));
    }

}
