package exalt.training.management.service;


import exalt.training.management.dto.*;
import exalt.training.management.exception.*;
import exalt.training.management.mapper.AppUserMapper;
import exalt.training.management.model.*;
import exalt.training.management.repository.AppUserRepository;
import exalt.training.management.repository.TokenRepository;
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
    //should use only service here !! I have to change it
    private final AppUserRepository appUserRepository;
    private final AppUserMapper appUserMapper;
    private final AppUserService appUserService;
    private final TokenService tokenService;
    private final TokenRepository tokenRepository;
    private final TraineeService traineeService;
    private final PasswordEncoder passwordEncoder;
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
        var jwtToken = tokenService.generateToken(user);
        //would I need to store the refresh token?
        var refreshToken = tokenService.generateRefreshToken(user);
        saveUserConfirmationToken(savedUser, jwtToken);
        if(tokenService.isTokenValid(jwtToken,savedUser)){
            sendAccountConfirmationEmail(user,tokenService.findByToken(jwtToken));
        }
        log.info("account need verification (NOT ACTIVE)");
        // Should better return a json object
        return "Verify your account by the link sent into your email address: " +user.getEmail();
    }




    public String forgotPasswordViaEmail(String email){
        AppUser user = appUserService.getUserByEmail(email);
        var forgotPasswordToken = tokenService.generateToken(user);
        saveUserForgotPasswordToken(user,forgotPasswordToken);
        if(tokenService.tokenExists(forgotPasswordToken)){
            sendForgotPasswordEmail(user,tokenService.findByToken(forgotPasswordToken));
        }
        log.info("An email has sent to you to change your password");
        return "An email has sent to you to change your password ";
    }


    public void sendAccountConfirmationEmail(AppUser user,Token token){
        SimpleMailMessage mailMessage = new SimpleMailMessage();
        mailMessage.setTo(user.getEmail());
        mailMessage.setSubject("[Training Management System] Complete Registration!");
        mailMessage.setText("To confirm your account in the Exalt Training Application, please click here : "
                +"http://localhost:8080/api/v1/auth/confirm-account?token="+token.getToken());
        emailService.sendEmail(mailMessage);
        log.info("Confirmation Token: " + token.getToken());
        log.info("Confirmation Token id : " + token.getId());
    }


    public void sendForgotPasswordEmail(AppUser user,Token token){
        SimpleMailMessage mailMessage = new SimpleMailMessage();
        mailMessage.setTo(user.getEmail());
        mailMessage.setSubject("[Training Management System] Please reset your password");
        mailMessage.setText("To change your password in the Exalt Training Application, please click here : "
                +"http://localhost:8080/api/v1/auth/forgot-password?token="+token.getToken());
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
        var jwtToken = tokenService.generateToken(user);
        var refreshToken = tokenService.generateRefreshToken(user);
        saveUserLoginToken(user, jwtToken);
        AppUserDto appUserDto = appUserMapper.userToUserDto(user);
        return AuthenticationResponse.builder()
                .accessToken(jwtToken)
                .refreshToken(refreshToken)
                .appUserDto(appUserDto)
                .build();
    }


    private void saveUserLoginToken(AppUser user, String jwtToken) {
        var token = Token.builder()
                .user(user)
                .token(jwtToken)
                .tokenType(TokenType.LOGIN)
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

    private void saveUserForgotPasswordToken(AppUser user, String jwtToken) {
        var token = Token.builder()
                .user(user)
                .token(jwtToken)
                .tokenType(TokenType.FORGOT_PASS)
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
    public String changePasswordViaEmail(String forgotPasswordToken,ForgotPasswordRequest forgotPasswordRequest) {
        Token token=  tokenService.findByToken(forgotPasswordToken);
        AppUser user = appUserRepository.findByEmail(token.getUser().getEmail()).orElseThrow(
                () -> new AppUserNotFoundException("User not found with this token")
        );
        if(!tokenService.isTokenValid(token.getToken(), token.getUser())){
            throw new InvalidTokenException("Token expired, try confirm your email again");
        }
        String newPass =forgotPasswordRequest.getNewPassword();
        String confirmationPass=forgotPasswordRequest.getConfirmationPassword();
        if(!newPass.equals(confirmationPass)){
            throw new IllegalStateException("Passwords are not the same");
        }
        user.setPassword(passwordEncoder.encode(newPass));
        appUserRepository.save(user);
        log.info("Password has been changed");
        return "Your password has been changed";
    }
    public ConfirmedAccountResponse confirmAccount(String confirmationToken) {
        ConfirmedAccountResponse confirmedAccountResponse=new ConfirmedAccountResponse();
        Token token=  tokenService.findByToken(confirmationToken);
        AppUser user = appUserRepository.findByEmail(token.getUser().getEmail()).orElseThrow(
                () -> new AppUserNotFoundException("User not found with this token")
        );
        if(!tokenService.isTokenValid(token.getToken(), token.getUser())){
            throw new InvalidTokenException("Token expired, try confirm your email again");
        }
        if(user.getEnabled()){
            confirmedAccountResponse.setStatus("ACTIVE");
            confirmedAccountResponse.setMessage("Account is activated before");
            return confirmedAccountResponse;
        }
        user.setEnabled(true);

        // This logic could be done in the appUserService
        if (user.getRole().equals(AppUserRole.TRAINEE)){
            Trainee trainee=new Trainee();
            user.setTrainee(trainee);
            trainee.setUser(user);
            traineeService.saveTrainee(trainee);
            log.info("account has been enabled (ACTIVE)");
        }
        log.info("account has been enabled (ACTIVE)");
        appUserRepository.save(user);
        confirmedAccountResponse.setStatus("ACTIVE");
        confirmedAccountResponse.setMessage("Account has been activated");
        log.info("%s account has been activated", user.getFirstName());
        return confirmedAccountResponse;
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
        userEmail = tokenService.extractEmail(refreshToken);
        if (userEmail != null) {
            var user = this.appUserRepository.findByEmail(userEmail)
                    .orElseThrow();
            if (tokenService.isTokenValid(refreshToken, user)) {
                var accessToken = tokenService.generateToken(user);
                revokeAllUserTokens(user);
                saveUserLoginToken(user, accessToken);
                var authResponse = AuthenticationResponse.builder()
                        .accessToken(accessToken)
                        .refreshToken(refreshToken)
                        .build();
                new ObjectMapper().writeValue(response.getOutputStream(), authResponse);
            }
        }
    }


}