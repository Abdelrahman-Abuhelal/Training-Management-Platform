package com.example.training.service;

import com.example.training.exception.AppUserNotFoundException;
import com.example.training.mapper.AppUserMapper;
import com.example.training.mapper.TraineeMapper;
import com.example.training.model.AppUser;
import com.example.training.model.AppUserResponseDto;
import com.example.training.repository.TraineeRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

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

}
