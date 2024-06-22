package exalt.training.management.service;

import exalt.training.management.dto.TraineeDataDto;
import exalt.training.management.exception.*;
import exalt.training.management.mapper.TraineeMapper;
import exalt.training.management.model.*;
import exalt.training.management.model.forms.Form;
import exalt.training.management.model.users.AppUser;
import exalt.training.management.model.users.Trainee;
import exalt.training.management.repository.AcademicGradesRepository;
import exalt.training.management.repository.TraineeRepository;
import jakarta.persistence.EntityManager;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.*;

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


    public String registerTraineeData(TraineeDataDto traineeDataDTO)  {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        var user = (AppUser) authentication.getPrincipal();
        // Should add exception if the user is not authenticated
        var trainee = user.getTrainee();
        if(trainee == null){
            throw new RuntimeException("User is not a registered as Trainee" );
        }
        String trainingField = traineeDataDTO.getTrainingField();
        if ( !TrainingField.isValid(trainingField) && !Objects.equals(trainingField, "")){
            throw new InvalidTrainingFieldException("Invalid Training Field");
        }
        String branchLocation = traineeDataDTO.getBranchLocation();
        if ( !BranchLocation.isValid(branchLocation) && !Objects.equals(branchLocation, "")){
            throw new InvalidBranchLocationException("Invalid Branch Location");
        }
        log.info("Received TraineeDataDto: {}", traineeDataDTO);

        Trainee traineeUpdated = traineeMapper.traineeDataDtoToTrainee(traineeDataDTO,trainee);

        traineeRepository.save(traineeUpdated);

        return "Trainee Data Registered Successfully";
    }

/*    public List<Form> findFormsByTraineeId(Long traineeId) {
        return entityManager.createQuery(
                        "SELECT f FROM Form f JOIN f.trainees t WHERE t.id = :traineeId", Form.class)
                .setParameter("traineeId", traineeId)
                .getResultList();
    }*/


}
