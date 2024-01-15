package exalt.training.management.service;

import exalt.training.management.dto.AppUserResponse;
import exalt.training.management.exception.AppUserNotFoundException;
import exalt.training.management.mapper.AppUserMapper;
import exalt.training.management.model.AppUser;
import exalt.training.management.model.AppUserRole;
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

    private final AppUserMapper userMapper;
    public AppUserResponse getTraineeById(Long id){
        Optional<AppUser> trainee=traineeRepository.findById(id);
        if (trainee.isEmpty()){
            String message=String.format("the trainee with the id %s  is not found",id);
            log.info(message);
            throw new AppUserNotFoundException(message);
        }
        return userMapper.userToUserDto(trainee.get());
    }


    public List<AppUserResponse> getAllTrainees(){
        Optional<List<AppUser>> trainees=traineeRepository.findByRole(AppUserRole.TRAINEE);
        if (trainees.isEmpty()){
            String message= "there are no trainees";
            log.info(message);
            throw new AppUserNotFoundException(message);
        }
        return userMapper.userToUserDto(trainees.get());
    }

    public void deleteTraineeByUsername(String username){
        Optional<AppUser> appUser = traineeRepository.findByEmail(username);
        if (appUser.isEmpty()){
            String message=String.format("the trainee with the username %s  is not found",username);
            log.info(message);
            throw new AppUserNotFoundException(message);
        }
        traineeRepository.delete(appUser.get());
        String message=String.format("the trainee with the username %s  is deleted",username);
        log.info(message);
    }

}