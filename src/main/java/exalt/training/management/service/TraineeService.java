package exalt.training.management.service;

import exalt.training.management.dto.TraineeDataDto;
import exalt.training.management.exception.AppUserNotFoundException;
import exalt.training.management.exception.InvalidAcademicCourseException;
import exalt.training.management.exception.InvalidUserException;
import exalt.training.management.mapper.TraineeMapper;
import exalt.training.management.model.AcademicGrades;
import exalt.training.management.model.AcademicGradesType;
import exalt.training.management.model.AppUser;
import exalt.training.management.model.Trainee;
import exalt.training.management.repository.AcademicGradesRepository;
import exalt.training.management.repository.TraineeRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
@Slf4j
public class TraineeService {

    private final TraineeRepository traineeRepository;
    private final TraineeMapper traineeMapper;

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


    public String registerTraineeData(TraineeDataDto traineeDataDTO )  {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        var user = (AppUser) authentication.getPrincipal();
        // Should add exception if the user is not authenticated
        var trainee = user.getTrainee();
        if(trainee == null){
            throw new RuntimeException("User is not a Trainee" );
        }
        log.info("Received TraineeDataDto: {}", traineeDataDTO);
        // SHOULD BE Set not a list
        List<AcademicGrades> gradeList = new ArrayList<>();
        var grades = traineeDataDTO.getAcademicGradesDto();
        log.info("grades: {}",grades);
        for (Map.Entry<String, Double> entry : grades.entrySet()) {
            String key = entry.getKey();
            Double value = entry.getValue();
            try {
               AcademicGradesType courseType = AcademicGradesType.valueOf(key.toUpperCase());
               AcademicGrades academicGrades = new AcademicGrades(courseType, value, trainee);
               gradeList.add(academicGrades);
            } catch (InvalidAcademicCourseException e) {
                throw new InvalidAcademicCourseException("Invalid Course: " + key);
            }
            }
        List<AcademicGrades> academicGrades = academicGradesRepository.saveAll(gradeList);
        Trainee traineeUpdated = traineeMapper.traineeDataDtoToTrainee(traineeDataDTO,trainee);
        if(!academicGrades.isEmpty()){
            traineeUpdated.setAcademicGrades(academicGrades);
            traineeRepository.save(trainee);
        }
        return "Trainee Data Registered Successfully";
    }

}
