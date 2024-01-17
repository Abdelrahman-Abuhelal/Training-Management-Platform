package exalt.training.management.service;

import exalt.training.management.dto.AppUserDto;
import exalt.training.management.exception.AppUserNotFoundException;
import exalt.training.management.mapper.AppUserMapper;
import exalt.training.management.model.AppUser;
import exalt.training.management.model.AppUserRole;
import exalt.training.management.model.Trainee;
import exalt.training.management.repository.AppUserRepository;
import exalt.training.management.repository.TraineeRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@Slf4j
@RequiredArgsConstructor

public class AdminService {

    private final TraineeRepository traineeRepository;

    private final AppUserRepository appUserRepository;

    private final AppUserMapper userMapper;


    public String deactivateUser(Long id){
        if(appUserRepository.findById(id).isEmpty()){
            throw new AppUserNotFoundException("There is no user with this ID");
        }
        appUserRepository.findById(id).get().setEnabled(false);
        return "User has been deactivated";
    }

    public Trainee getTraineeById(Long id){
        Optional<Trainee> trainee=traineeRepository.findById(id);
        if (trainee.isEmpty()){
            String message=String.format("the trainee with the id %s  is not found",id);
            log.info(message);
            throw new AppUserNotFoundException(message);
        }
        return trainee.get();
    }


    public List<Trainee> getAllTrainees(){
        List<Trainee> trainees=traineeRepository.findAll();
        if (trainees.isEmpty()){
            String message= "there are no trainees";
            log.info(message);
            throw new AppUserNotFoundException(message);
        }
        return trainees;
    }

/*    public void deleteTraineeByUsername(String username){
        Optional<AppUser> appUser = traineeRepository.findByEmail(username);
        if (appUser.isEmpty()){
            String message=String.format("the trainee with the username %s  is not found",username);
            log.info(message);
            throw new AppUserNotFoundException(message);
        }
        traineeRepository.delete(appUser.get());
        String message=String.format("the trainee with the username %s  is deleted",username);
        log.info(message);
    }*/

}