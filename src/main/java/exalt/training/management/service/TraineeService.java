package exalt.training.management.service;

import exalt.training.management.dto.TraineeDataDto;
import exalt.training.management.mapper.AcademicGradesMapper;
import exalt.training.management.mapper.TraineeMapper;
import exalt.training.management.model.AcademicGrades;
import exalt.training.management.model.AppUser;
import exalt.training.management.model.Trainee;
import exalt.training.management.repository.TraineeRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Lazy;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.security.Principal;

@Service
@Slf4j
public class TraineeService {

    private final TraineeRepository traineeRepository;
    private final AuthenticationService authenticationService;
    private final TraineeMapper traineeMapper;
    private final AcademicGradesMapper academicGradesMapper;
    private final AcademicGradesService academicGradesService;

    public TraineeService(TraineeRepository traineeRepository,
                          AuthenticationService authenticationService,
                          TraineeMapper traineeMapper, AcademicGradesMapper academicGradesMapper,
                          AcademicGradesService academicGradesService) {
        this.traineeRepository = traineeRepository;
        this.authenticationService = authenticationService;
        this.traineeMapper = traineeMapper;
        this.academicGradesMapper = academicGradesMapper;
        this.academicGradesService = academicGradesService;
    }

    public void saveTrainee(Trainee trainee){
        traineeRepository.save(trainee);
    }

   public String registerTraineeData(TraineeDataDto traineeDataDTO, Principal connectedUser )  {
       authenticationService.checkConnectedUserAuthentication(connectedUser);
       var user = (AppUser) ((UsernamePasswordAuthenticationToken) connectedUser).getPrincipal();
       log.info("Received TraineeDataDto: {}", traineeDataDTO);
       var grades = traineeDataDTO.getAcademicGradesDto();
       var trainee = user.getTrainee();
       log.info("grades: {}",grades);
       AcademicGrades academicGrades = academicGradesMapper.academicGradesDtoToAcademicGrades(grades);
       academicGrades.setTrainee(trainee);
       academicGradesService.saveAcademicGrades(academicGrades);
       Trainee traineeUpdated = traineeMapper.traineeDataDtoToTrainee(traineeDataDTO,user.getTrainee());
       traineeUpdated.setAcademicGrades(academicGrades);
       saveTrainee(traineeUpdated);
       return "Trainee Data Registered Successfully";
    }

}
