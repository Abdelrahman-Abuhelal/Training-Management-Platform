package com.example.training.controller;

import com.example.training.dto.AuthenticationResponse;
import com.example.training.dto.LoginRequest;
import com.example.training.dto.RegistrationRequest;
import com.example.training.service.AuthenticationService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthenticationController {

    private final AuthenticationService authService;


    // I should make one dto for registration then in the method specify the role
    @PostMapping("/register")
    public ResponseEntity<String> registerTrainee(@RequestBody RegistrationRequest request
    ) {
        return ResponseEntity.ok(authService.registerUser(request));
    }


    @PostMapping("/login")
    public ResponseEntity<AuthenticationResponse> authenticate(
            @RequestBody LoginRequest request
    ) {
        return ResponseEntity.ok(authService.authenticate(request));
    }

    @GetMapping(value="/confirm-account")
    public String confirmUserAccount(@RequestParam("token")String confirmationToken) {
        return authService.confirmEmail(confirmationToken);
    }

    @PostMapping("/refresh-token")
    public void refreshToken(
            HttpServletRequest request,
            HttpServletResponse response
    ) throws IOException {
        authService.refreshToken(request, response);
    }

}
