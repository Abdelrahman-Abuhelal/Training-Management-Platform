package com.example.training.service;

import com.example.training.dto.AuthenticationResponse;
import com.example.training.dto.ChangePasswordRequest;
import com.example.training.dto.LoginRequest;
import com.example.training.dto.RegistrationRequest;
import com.example.training.exception.AppUserNotFoundException;
import com.example.training.exception.InvalidTokenException;
import com.example.training.exception.TokenNotFoundException;
import com.example.training.exception.UserAlreadyExistsException;
import com.example.training.model.AppUser;
import com.example.training.model.AppUserRole;
import com.example.training.model.Token;
import com.example.training.model.TokenType;
import com.example.training.repository.AppUserRepository;
import com.example.training.repository.TokenRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpHeaders;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.security.Principal;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthenticationService {
    private final AppUserRepository appUserRepository;
    private final TokenRepository tokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final EmailService emailService;

    public String registerUser(RegistrationRequest request) {
        if (userAlreadyExists(request.getUsername())){
            throw new UserAlreadyExistsException(request.getUsername() + " already exists!");
        }
        //  Currently it register only as trainee
        var user = AppUser.builder()
                .firstName(request.getFirstName())
                .username(request.getUsername())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(AppUserRole.TRAINEE)
                .enabled(false)
                .build();

        var savedUser = appUserRepository.save(user);
        var jwtToken = jwtService.generateToken(user);
        //would I need to store the refresh token?
        var refreshToken = jwtService.generateRefreshToken(user);
        saveUserConfirmationToken(savedUser, jwtToken);
        if(tokenRepository.findByToken(jwtToken).isPresent()){
            sendEmailMessage(user,tokenRepository.findByToken(jwtToken).get());
        }
        // Should better return a json object
        return "Verify your account by the link sent into your email address: " +user.getUsername();
    }

    public void sendEmailMessage(AppUser user,Token token){
        SimpleMailMessage mailMessage = new SimpleMailMessage();
        mailMessage.setTo(user.getUsername());
        mailMessage.setSubject("Complete Registration!");
        mailMessage.setText("To confirm your account, please click here : "
                +"http://localhost:8080/api/v1/auth/confirm-account?token="+token.getToken());
        emailService.sendEmail(mailMessage);
        log.info("Confirmation Token: " + token.getToken());
        log.info("Confirmation Token id : " + token.getId());
    }

    public boolean userAlreadyExists(String username){
        return appUserRepository.findByUsername(username).isPresent();
    }

    public AuthenticationResponse authenticate(LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getUsername(),
                        request.getPassword()
                )
        );
        var user = appUserRepository.findByUsername(request.getUsername())
                .orElseThrow();
        var jwtToken = jwtService.generateToken(user);
        var refreshToken = jwtService.generateRefreshToken(user);
        saveUserToken(user, jwtToken);
        return AuthenticationResponse.builder()
                .accessToken(jwtToken)
                .refreshToken(refreshToken)
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

    private void saveUserConfirmationToken(AppUser user, String jwtToken) {
        var token = Token.builder()
                .user(user)
                .token(jwtToken)
                .tokenType(TokenType.CONFIRMATION_TOKEN)
                .expired(false)
                .revoked(false)
                .build();
        tokenRepository.save(token);
    }


    private void revokeAllUserTokens(AppUser user) {
        var validUserTokens = tokenRepository.findAllValidTokenByUser(user.getId());
        if (validUserTokens.isEmpty())
            return;
        validUserTokens.forEach(token -> {
            token.setExpired(true);
            token.setRevoked(true);
        });
        tokenRepository.saveAll(validUserTokens);
    }

    public String confirmEmail(String confirmationToken) {
       Token token=  tokenRepository.findByToken(confirmationToken).orElseThrow(
               ()-> new TokenNotFoundException("Given Token not found stored"));
       AppUser user = appUserRepository.findByUsername(token.getUser().getUsername()).orElseThrow(
               () -> new AppUserNotFoundException("User not found with this token")
       );
        if(!jwtService.isTokenValid(token.getToken(), token.getUser())){
            throw new InvalidTokenException("Token expired, try confirm your email again");
        }
        user.setEnabled(true);
       appUserRepository.save(user);
       return "User "+ user.getFirstName() +" account has been activated";
    }

    public void changePassword(ChangePasswordRequest request, Principal connectedUser) {

        var user = (AppUser) ((UsernamePasswordAuthenticationToken) connectedUser).getPrincipal();

        // check if the current password is correct
        if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPassword())) {
            throw new IllegalStateException("Wrong password");
        }
        // check if the two new passwords are the same
        if (!request.getNewPassword().equals(request.getConfirmationPassword())) {
            throw new IllegalStateException("Password are not the same");
        }

        // update the password
        user.setPassword(passwordEncoder.encode(request.getNewPassword()));

        // save the new password
        appUserRepository.save(user);
    }
    public void refreshToken(
            HttpServletRequest request,
            HttpServletResponse response
    ) throws IOException {
        final String authHeader = request.getHeader(HttpHeaders.AUTHORIZATION);
        final String refreshToken;
        final String userEmail;
        if (authHeader == null ||!authHeader.startsWith("Bearer ")) {
            return;
        }
        refreshToken = authHeader.substring(7);
        userEmail = jwtService.extractUsername(refreshToken);
        if (userEmail != null) {
            var user = this.appUserRepository.findByUsername(userEmail)
                    .orElseThrow();
            if (jwtService.isTokenValid(refreshToken, user)) {
                var accessToken = jwtService.generateToken(user);
                revokeAllUserTokens(user);
                saveUserToken(user, accessToken);
                var authResponse = AuthenticationResponse.builder()
                        .accessToken(accessToken)
                        .refreshToken(refreshToken)
                        .build();
                new ObjectMapper().writeValue(response.getOutputStream(), authResponse);
            }
        }
    }


}