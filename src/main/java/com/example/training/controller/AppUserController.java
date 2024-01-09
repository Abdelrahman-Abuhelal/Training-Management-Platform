package com.example.training.controller;


import com.example.training.dto.AppUserResponseDto;
import com.example.training.service.AppUserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/users")
public class AppUserController {

    private final AppUserService appUserService;


    @GetMapping
    public ResponseEntity<List<AppUserResponseDto>> getAllUsers(){
        List<AppUserResponseDto> userList= appUserService.getAllUsers();
        return new ResponseEntity<>(userList, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<AppUserResponseDto> getUserById(@PathVariable Long id){
        AppUserResponseDto userResponseDto= appUserService.getUserById(id);
        return new ResponseEntity<>(userResponseDto, HttpStatus.OK);
    }


//   @PostMapping
//   public ResponseEntity<AppUserResponseDto> login(@RequestBody LoginRequestDto loginRequestDto) {
//       AppUserResponseDto userResponseDto = traineeRegistrationService.login(loginRequestDto);
//       return new ResponseEntity<>(userResponseDto, HttpStatus.OK);
//   }




}
