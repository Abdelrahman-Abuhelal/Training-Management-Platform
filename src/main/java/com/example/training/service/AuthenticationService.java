package com.example.training.service;

import com.example.training.dto.*;
import com.example.training.exception.*;
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
        if (userAlreadyExists(request.getEmail())){
            throw new UserAlreadyExistsException(request.getEmail() + " already exists!");
        }
        var user = AppUser.builder()
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .role(request.getRole())
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
        log.info("account need verification (NOT ACTIVE)");
        // Should better return a json object
        return "Verify your account by the link sent into your email address: " +user.getEmail();
    }

    public void sendEmailMessage(AppUser user,Token token){
        SimpleMailMessage mailMessage = new SimpleMailMessage();
        mailMessage.setTo(user.getEmail());
        mailMessage.setSubject("Complete Registration!");
        mailMessage.setText("To confirm your account in the Exalt Training Application, please click here : "
                +"http://localhost:8080/api/v1/auth/confirm-account?token="+token.getToken());
        emailService.sendEmail(mailMessage);
        log.info("Confirmation Token: " + token.getToken());
        log.info("Confirmation Token id : " + token.getId());
    }

    public boolean userAlreadyExists(String username){
        return appUserRepository.findByEmail(username).isPresent();
    }

    public AuthenticationResponse authenticate(LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );
        var user = appUserRepository.findByEmail(request.getEmail())
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
        var validUserTokens = appUserRepository.findAllValidTokenByUser(user.getId());
        if (validUserTokens.isEmpty())
            return;
        validUserTokens.forEach(token -> {
            token.setExpired(true);
            token.setRevoked(true);
        });
        tokenRepository.saveAll(validUserTokens);
    }

    public ConfirmedAccountResponse confirmAccount(String confirmationToken) {
        ConfirmedAccountResponse confirmedAccountResponse=new ConfirmedAccountResponse();
        Token token=  tokenRepository.findByToken(confirmationToken).orElseThrow(
                ()-> new TokenNotFoundException("Given Token not found stored"));
        AppUser user = appUserRepository.findByEmail(token.getUser().getEmail()).orElseThrow(
                () -> new AppUserNotFoundException("User not found with this token")
        );
        if(!jwtService.isTokenValid(token.getToken(), token.getUser())){
            throw new InvalidTokenException("Token expired, try confirm your email again");
        }
        if(user.getEnabled()){
            confirmedAccountResponse.setStatus("ACTIVE");
            confirmedAccountResponse.setMessage("Account is activated before");
            throw new AccountAlreadyActivatedException("Account is activated before");
        }
        user.setEnabled(true);
        log.info("account has been enabled (ACTIVE)");
        appUserRepository.save(user);
        confirmedAccountResponse.setStatus("ACTIVE");
        confirmedAccountResponse.setMessage("Account has been activated");
        log.info("%s account has been activated", user.getFirstName());
        return confirmedAccountResponse;
    }

   /* public void changePassword(ChangePasswordRequest request, Principal connectedUser) {

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
    }*/

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
        userEmail = jwtService.extractEmail(refreshToken);
        if (userEmail != null) {
            var user = this.appUserRepository.findByEmail(userEmail)
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