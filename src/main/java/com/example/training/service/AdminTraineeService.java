package com.example.training.service;

import com.example.training.exception.AppUserNotFoundException;
import com.example.training.mapper.AppUserMapper;
import com.example.training.model.AppUser;
import com.example.training.dto.AppUserResponseDto;
import com.example.training.model.AppUserRole;
import com.example.training.repository.TraineeRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@Slf4j
@RequiredArgsConstructor

public class AdminTraineeService {

    private final TraineeRepository traineeRepository;

    private final AppUserMapper userMapper;
    public AppUserResponseDto getTraineeById(Long id){
        Optional<AppUser> trainee=traineeRepository.findById(id);
        if (trainee.isEmpty()){
            String message=String.format("the trainee with the id %s  is not found",id);
            log.info(message);
            throw new AppUserNotFoundException(message);
        }
        return userMapper.userToUserDto(trainee.get());
    }


    public List<AppUserResponseDto> getAllTrainees(){
        Optional<List<AppUser>> trainees=traineeRepository.findByRole(AppUserRole.TRAINEE);
        if (trainees.isEmpty()){
            String message= "there are no trainees";
            log.info(message);
            throw new AppUserNotFoundException(message);
        }
        return userMapper.userToUserDto(trainees.get());
    }

    public void deleteTraineeByUsername(String username){
        Optional<AppUser> appUser = traineeRepository.findByUsername(username);
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
