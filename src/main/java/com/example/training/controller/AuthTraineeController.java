package com.example.training.controller;


import com.example.training.dto.TraineeRegistrationDto;
import com.example.training.model.AppUserResponseDto;
import com.example.training.service.AdminTraineeService;
import com.example.training.service.TraineeRegistrationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/auth/trainees")
public class AuthTraineeController {


    private final TraineeRegistrationService traineeRegistrationService;
    private final AdminTraineeService adminTraineeService;


    @PostMapping
    public ResponseEntity<AppUserResponseDto> registerTrainee(@RequestBody TraineeRegistrationDto traineeRegistrationDto){
        AppUserResponseDto userResponseDto = traineeRegistrationService.registerTrainee(traineeRegistrationDto);
        return new ResponseEntity<>(userResponseDto, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<AppUserResponseDto> getTraineeById(@PathVariable Long id){
        AppUserResponseDto userResponseDto = adminTraineeService.getTraineeById(id);
        return new ResponseEntity<>(userResponseDto, HttpStatus.OK);
    }

}
