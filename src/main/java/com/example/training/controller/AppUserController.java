package com.example.training.controller;


import com.example.training.dto.AppUserResponse;
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
    public ResponseEntity<List<AppUserResponse>> getAllUsers(){
        List<AppUserResponse> userList= appUserService.getAllUsers();
        return new ResponseEntity<>(userList, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<AppUserResponse> getUserById(@PathVariable Long id){
        AppUserResponse userResponseDto= appUserService.getUserById(id);
        return new ResponseEntity<>(userResponseDto, HttpStatus.OK);
    }


//   @PostMapping
//   public ResponseEntity<AppUserResponse> login(@RequestBody LoginRequestDto loginRequestDto) {
//       AppUserResponse userResponseDto = traineeRegistrationService.login(loginRequestDto);
//       return new ResponseEntity<>(userResponseDto, HttpStatus.OK);
//   }




}
