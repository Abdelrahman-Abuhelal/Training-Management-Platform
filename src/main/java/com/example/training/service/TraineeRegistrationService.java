package com.example.training.service;


import com.example.training.dto.TraineeRegistrationDto;
import com.example.training.mapper.AppUserMapper;
import com.example.training.mapper.TraineeMapper;
import com.example.training.model.AppUser;
import com.example.training.dto.AppUserResponseDto;
import com.example.training.repository.TraineeRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j

public class TraineeRegistrationService {

    private final TraineeRepository traineeRepository;

    private final TraineeMapper traineeMapper;

    private final AppUserMapper appUserMapper;



    public AppUserResponseDto registerTrainee(TraineeRegistrationDto traineeRegistrationDto){
        AppUser appUser= traineeMapper.registeredTraineeToUser(traineeRegistrationDto);
        AppUser savedTraineeUser=traineeRepository.save(appUser);
        return appUserMapper.userToUserDto(savedTraineeUser);
    }



}
