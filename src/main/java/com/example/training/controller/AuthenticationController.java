package com.example.training.controller;

import com.example.training.dto.AuthenticationResponse;
import com.example.training.dto.LoginRequestDto;
import com.example.training.dto.RegistrationRequest;
import com.example.training.service.AuthenticationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthenticationController {

    private final AuthenticationService service;


    // I should make one dto for registration then in the method specify the role
    @PostMapping("/register")
    public ResponseEntity<AuthenticationResponse> registerTrainee(@RequestBody RegistrationRequest request
    ) {
        return ResponseEntity.ok(service.registerTrainee(request));
    }


    @PostMapping("/login")
    public ResponseEntity<AuthenticationResponse> authenticate(
            @RequestBody LoginRequestDto request
    ) {
        return ResponseEntity.ok(service.authenticate(request));
    }
}
