package com.example.training.service;

import com.example.training.config.JwtService;
import com.example.training.dto.AuthenticationResponse;
import com.example.training.dto.LoginRequestDto;
import com.example.training.dto.RegistrationRequest;
import com.example.training.model.AppUser;
import com.example.training.model.AppUserRole;
import com.example.training.model.Token;
import com.example.training.model.TokenType;
import com.example.training.repository.AppUserRepository;
import com.example.training.repository.TokenRepository;
import com.example.training.repository.TraineeRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.io.IOException;

@Service
@RequiredArgsConstructor
public class AuthenticationService {
    private final TraineeRepository traineeRepository;
    private final AppUserRepository appUserRepository;

    private final TokenRepository tokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    public AuthenticationResponse registerTrainee(RegistrationRequest request) {
        var user = AppUser.builder()
                .firstName(request.getFirstName())
                .username(request.getUsername())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(AppUserRole.TRAINEE)
                .build();
        var savedTrainee = traineeRepository.save(user);
        var jwtToken = jwtService.generateToken(user);
        saveUserToken(savedTrainee, jwtToken);
        return AuthenticationResponse.builder()
                .token(jwtToken)
                .build();
    }

    public AuthenticationResponse authenticate(LoginRequestDto request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getUsername(),
                        request.getPassword()
                )
        );
        var user = appUserRepository.findByUsername(request.getUsername())
                .orElseThrow();
        var jwtToken = jwtService.generateToken(user);
        saveUserToken(user, jwtToken);
        return AuthenticationResponse.builder()
                .token(jwtToken)
                .build();
    }

    private void saveUserToken(AppUser user, String jwtToken) {
        var token = Token.builder()
                .user(user)
                .token(jwtToken)
                .tokenType(TokenType.BEARER)
                .expired(false)
                .revoked(false)
                .build();
        tokenRepository.save(token);
    }




}