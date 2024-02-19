package exalt.training.management.service;

import exalt.training.management.dto.TraineeDataDto;
import exalt.training.management.exception.*;
import exalt.training.management.mapper.TraineeMapper;
import exalt.training.management.model.*;
import exalt.training.management.repository.AcademicGradesRepository;
import exalt.training.management.repository.TraineeRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
@Slf4j
public class TraineeService {

    private final TraineeRepository traineeRepository;
    private final TraineeMapper traineeMapper;
    private final EnumSet<CourseType> validCourseTypes = EnumSet.allOf(CourseType.class);

    private final AcademicGradesRepository academicGradesRepository;


    public TraineeService(TraineeRepository traineeRepository,
                          TraineeMapper traineeMapper,
                         AcademicGradesRepository academicGradesRepository) {
        this.traineeRepository = traineeRepository;
        this.traineeMapper = traineeMapper;
        this.academicGradesRepository = academicGradesRepository;
    }

    public void saveTrainee(Trainee trainee){
        traineeRepository.save(trainee);
    }

    public Trainee getMyProfileInfo(){
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        var user = (AppUser) authentication.getPrincipal();
        var trainee = user.getTrainee();
        if(trainee == null){
            throw new InvalidUserException("User is not a Trainee" );
        }
        Optional<Trainee> traineeInfo=traineeRepository.findById(trainee.getId());
        if (traineeInfo.isEmpty()){
            String message=String.format("the trainee  does not have information");
            log.info(message);
            throw new AppUserNotFoundException(message);
        }
        return traineeInfo.get();
    }


    public String registerTraineeData(TraineeDataDto traineeDataDTO)  {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        var user = (AppUser) authentication.getPrincipal();
        // Should add exception if the user is not authenticated
        var trainee = user.getTrainee();
        if(trainee == null){
            throw new RuntimeException("User is not a registered as Trainee" );
        }
        var trainingField = traineeDataDTO.getTrainingField();
        if ( !TrainingField.isValid(trainingField) && trainingField != null){
            throw new InvalidTrainingFieldException("Invalid Training Field");
        }
        var branchLocation = traineeDataDTO.getBranchLocation();
        if ( !BranchLocation.isValid(branchLocation) && branchLocation != null){
            throw new InvalidBranchLocationException("Invalid Branch Location");
        }
        log.info("Received TraineeDataDto: {}", traineeDataDTO);

       /* Map<String, Double> grades = traineeDataDTO.getAcademicGradesDto();
        log.info("grades: {}",grades);
        // Uppercase the keys before validation
        Set<String> uppercaseKeys = grades.keySet().stream().map(String::toUpperCase).collect(Collectors.toSet());
        try {
            if (!uppercaseKeys.stream().allMatch(key -> validCourseTypes.contains(CourseType.valueOf(key)))) {
                throw new InvalidAcademicCourseException("Invalid course types found in academicGradesDto");
            }
        }catch (IllegalArgumentException e){
            throw new InvalidAcademicCourseException("Invalid course type found in academicGradesDto");
        }
        for (Map.Entry<String, Double> entry : grades.entrySet()) {
            String key = entry.getKey();
            Double mark = entry.getValue();
            try {
                // Check for existing grade with the same courseType and trainee
                CourseType courseType = CourseType.valueOf(key.toUpperCase());

                Optional<AcademicGrades> existingGrade = academicGradesRepository.findAcademicGradesByTypeAndTrainee_Id(courseType, trainee.getId());

                if (existingGrade.isPresent()) {
                    existingGrade.get().setMark(mark);
                    academicGradesRepository.save(existingGrade.get());
                } else {
                    // Create new grade
                    AcademicGrades newGrade = new AcademicGrades(courseType, mark, trainee);
                    academicGradesRepository.save(newGrade);
                }
            } catch (InvalidAcademicCourseException e) {
                throw new InvalidAcademicCourseException("Invalid Course type : " + key);
            }
            }*/
//        traineeUpdated.setAcademicGrades(academicGrades);
        Trainee traineeUpdated = traineeMapper.traineeDataDtoToTrainee(traineeDataDTO,trainee);

        traineeRepository.save(traineeUpdated);

        return "Trainee Data Registered Successfully";
    }

}
