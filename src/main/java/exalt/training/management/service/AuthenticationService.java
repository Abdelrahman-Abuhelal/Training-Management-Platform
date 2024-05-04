package exalt.training.management.service;


import exalt.training.management.dto.*;
import exalt.training.management.exception.*;
import exalt.training.management.mapper.AppUserMapper;
import exalt.training.management.model.*;
import exalt.training.management.model.users.AppUser;
import exalt.training.management.repository.AppUserRepository;
import exalt.training.management.repository.TokenRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.security.Principal;

@Service
@Slf4j
public class AuthenticationService {
    //  only use services here !! I have to change it
    private final AppUserRepository appUserRepository;
    private final  AppUserService appUserService;
    private final AppUserMapper appUserMapper;
    private final TokenService tokenService;
    private final TokenRepository tokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final EmailService emailService;
    @Autowired
    public AuthenticationService(AppUserRepository appUserRepository,
                                 AppUserService appUserService,
                                 AppUserMapper appUserMapper,
                                 TokenService tokenService,
                                 TokenRepository tokenRepository,
                                 PasswordEncoder passwordEncoder,
                                 AuthenticationManager authenticationManager,
                                 EmailService emailService) {
        this.appUserRepository = appUserRepository;
        this.appUserService = appUserService;
        this.appUserMapper = appUserMapper;
        this.tokenService = tokenService;
        this.tokenRepository = tokenRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.emailService = emailService;
    }


    public String forgotPasswordViaEmail(ForgotPasswordEmail forgotPasswordEmail){
        log.info("forgotPasswordViaEmail: " + forgotPasswordEmail.getEmail());
        AppUser user = appUserService.getUserByEmail(forgotPasswordEmail.getEmail());
        if (!user.isEnabled()){
            throw new InvalidUserException("User is not activated, Your account need registration or confirmation via Email");
        }
        String forgotPasswordToken = tokenService.generateForgotPassword(user);
        saveUserForgotPasswordToken(user,forgotPasswordToken);
        // not valid token is not handled here!
        if(!tokenService.tokenExists(forgotPasswordToken)){
            throw new InvalidTokenException("Token is not valid");
        }
        sendForgotPasswordEmail(user,forgotPasswordToken);

        log.info("An email has sent to you to change your password");
        return "An email has sent to you to change your password ";
    }




    public void sendForgotPasswordEmail(AppUser user,String token){
        SimpleMailMessage mailMessage = new SimpleMailMessage();
        mailMessage.setTo(user.getEmail());
        mailMessage.setSubject("[Training Management System] Please reset your password");
        mailMessage.setText("To change your password in the Exalt Training Application, please click here : "
                +"http://localhost:5173/forgot-password-reset/"+token);
        emailService.sendEmail(mailMessage);
        log.info("Forgot-Pass Token: " + token);
    }

    public void checkConnectedUserAuthentication(Principal connectedAppUser) {
        if (!(connectedAppUser instanceof UsernamePasswordAuthenticationToken)) {
            throw new InvalidUserAuthenticationException("Invalid user authentication");
        }
    }
    public AuthenticationResponse authenticate(LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );
        var user = appUserRepository.findByEmail(request.getEmail())
                .orElseThrow(()->new AppUserNotFoundException("User login with this email doesn't exist "));
        if(!user.isEnabled()){
            throw new InvalidUserException("User is not activated, Your account need registration or confirmation via Email");
        }
        var jwtToken = tokenService.generateLogin(user);
        var refreshToken = tokenService.generateRefreshToken(user);
        saveUserLoginToken(user, jwtToken);
        AppUserDto appUserDto = appUserMapper.userToUserDto(user);
        return AuthenticationResponse.builder()
                .loginToken(jwtToken)
                .refreshToken(refreshToken)
                .appUserDto(appUserDto)
                .build();
    }

    public String checkAuthHeader(HttpServletRequest request){
        final String authHeader = request.getHeader(HttpHeaders.AUTHORIZATION);
        final String jwt;
        //check if the JWT token doesn't  exist
        if (authHeader == null ||!authHeader.startsWith("Bearer ")) {
            throw new InvalidTokenException("Token not found");
        }
        jwt = authHeader.substring(7);
        return jwt;
    }
    public void saveUserLoginToken(AppUser user, String jwtToken) {
        var token = Token.builder()
                .user(user)
                .token(jwtToken)
                .tokenType(TokenType.LOGIN)
                .expired(false)
                .revoked(false)
                .build();
        tokenRepository.save(token);
    }

    public void saveUserConfirmationToken(AppUser user, String jwtToken) {
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
        var validUserTokens = tokenRepository.findAllValidTokenByUser(user.getId());
        if (validUserTokens.isEmpty())
            return;
        validUserTokens.forEach(token -> {
            token.setExpired(true);
            token.setRevoked(true);
        });
        tokenRepository.saveAll(validUserTokens);
    }

    public void checkValidPasswordMatch(String password, String confirmPassword) {
        if(!password.equals(confirmPassword)){
            throw new IllegalStateException("Passwords are not the same");
        }
    }

    public String changePasswordViaEmail (HttpServletRequest request,PasswordRequest forgotPasswordRequest)  throws IOException {
        final String userEmail;
        final String forgotPassJwt = checkAuthHeader(request);
        var isTokenValid = tokenService.isForgetPasswordTokenValid(forgotPassJwt);
        userEmail = tokenService.extractEmail(forgotPassJwt);
        AppUser user=appUserService.getUserByEmail(userEmail);
        if (!(tokenService.isTokenValid(forgotPassJwt, user) && isTokenValid)){
            throw new InvalidTokenException("token is not valid");
        }
        checkValidPasswordMatch(forgotPasswordRequest.getNewPassword(),forgotPasswordRequest.getConfirmationPassword());
        user.setPassword(passwordEncoder.encode(forgotPasswordRequest.getNewPassword()));
        appUserRepository.save(user);
        log.info("Password has been changed");
        return "Your password has been changed";
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
                var loginToken = tokenService.generateRefreshToken(user);
                revokeAllUserTokens(user);
                saveUserLoginToken(user, loginToken);
                var authResponse = AuthenticationResponse.builder()
                        .loginToken(loginToken)
                        .refreshToken(refreshToken)
                        .build();
                response.setStatus(HttpServletResponse.SC_OK);
                new ObjectMapper().writeValue(response.getOutputStream(), authResponse);
            }
        }else {
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
        }
    }


}