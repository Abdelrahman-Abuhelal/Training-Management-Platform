package exalt.training.management.service;

import exalt.training.management.dto.ChangePasswordRequest;
import exalt.training.management.dto.ConfirmedAccountResponse;
import exalt.training.management.dto.PasswordRequest;
import exalt.training.management.exception.*;
import exalt.training.management.mapper.AppUserMapper;
import exalt.training.management.model.*;
import exalt.training.management.repository.AppUserRepository;
import exalt.training.management.repository.TokenRepository;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Lazy;
import org.springframework.http.HttpHeaders;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.security.Principal;

@Service
@Slf4j
public class AppUserService {

    private final AppUserRepository appUserRepository;
    private final AuthenticationService authenticationService;
    private final PasswordEncoder passwordEncoder;
    private final TraineeService traineeService;
    private final SupervisorService supervisorService;
    private final SuperAdminService superAdminService;
    private final TokenService tokenService;
    private final TokenRepository tokenRepository;

    public AppUserService(AppUserRepository appUserRepository,
                          @Lazy AuthenticationService authenticationService,
                          PasswordEncoder passwordEncoder,
                          TraineeService traineeService,
                          SupervisorService supervisorService,
                          SuperAdminService superAdminService,
                          TokenService tokenService,
                          TokenRepository tokenRepository) {
        this.appUserRepository = appUserRepository;
        this.authenticationService = authenticationService;
        this.passwordEncoder = passwordEncoder;
        this.traineeService = traineeService;
        this.supervisorService = supervisorService;
        this.superAdminService = superAdminService;
        this.tokenService = tokenService;
        this.tokenRepository = tokenRepository;
    }


    public ConfirmedAccountResponse confirmAccount(HttpServletRequest request,PasswordRequest passwordRequest) {
        ConfirmedAccountResponse confirmedAccountResponse=new ConfirmedAccountResponse();
        final String authHeader = request.getHeader(HttpHeaders.AUTHORIZATION);
        final String jwt;
        final String userEmail;
        //check if the JWT token doesn't  exist
        if (authHeader == null ||!authHeader.startsWith("Bearer ")) {
            throw new InvalidTokenException("Token not found");
        }
        jwt = authHeader.substring(7);
        var isTokenValid = tokenRepository.findTokenByTokenTypeAndToken(TokenType.CONFIRMATION_TOKEN,jwt)
                .map(t -> !t.isExpired() && !t.isRevoked())
                .orElse(false);
        userEmail = tokenService.extractEmail(jwt);
        log.info(userEmail+" is trying to activate his account");
        AppUser user=getUserByEmail(userEmail);
        if (!(tokenService.isTokenValid(jwt, user) && isTokenValid)){
            throw new InvalidTokenException("token is not valid");
        }
        if(user.getEnabled()){
            throw new AccountAlreadyActivatedException("Account is already activated before");
        }
        String newPass =passwordRequest.getNewPassword();
        String confirmationPass=passwordRequest.getConfirmationPassword();
        if(!newPass.equals(confirmationPass)){
            throw new IllegalStateException("Passwords are not the same");
        }
        user.setPassword(passwordEncoder.encode(newPass));
        user.setEnabled(true);
        saveUser(user);
        confirmedAccountResponse.setStatus("ACTIVE");
        confirmedAccountResponse.setMessage("Account has been activated");
        log.info(user.getFirstName()+" account has been activated (ACTIVE)");
        return confirmedAccountResponse;
    }

    public boolean userAlreadyExists(String username){
        return appUserRepository.findByEmail(username).isPresent();
    }

    public void handleUserRole(AppUser user) {
        switch (user.getRole()) {
            case TRAINEE:
                handleTrainee(user);
                break;
            case SUPERVISOR:
                handleSupervisor(user);
                break;
            case SUPER_ADMIN:
                handleSuperAdmin(user);
                break;
            default:
                throw new InvalidUserRoleException("Invalid user role");
        }
    }

    private void handleTrainee(AppUser user) {
        Trainee trainee = new Trainee();
        user.setTrainee(trainee);
        trainee.setUser(user);
        traineeService.saveTrainee(trainee);
    }

    private void handleSupervisor(AppUser user) {
        Supervisor supervisor = new Supervisor();
        user.setSupervisor(supervisor);
        supervisor.setUser(user);
        supervisorService.saveSupervisor(supervisor);
    }

    private void handleSuperAdmin(AppUser user) {
        SuperAdmin superAdmin = new SuperAdmin();
        user.setSuperAdmin(superAdmin);
        superAdmin.setUser(user);
        superAdminService.saveSuperAdmin(superAdmin);
    }

    public void saveUser(AppUser appUser){
        handleUserRole(appUser);
        appUserRepository.save(appUser);
    }


    public String changePassword(ChangePasswordRequest request, Principal connectedUser) {
// i want to get the user from the token
        authenticationService.checkConnectedUserAuthentication(connectedUser);

        var user = (AppUser) ((UsernamePasswordAuthenticationToken) connectedUser).getPrincipal();

        // check if the current password is correct
        if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPassword())) {
            throw new IllegalStateException("Wrong password");
        }
        // check if the two new passwords are the same
        if (!request.getNewPassword().equals(request.getConfirmationPassword())) {
            throw new IllegalStateException("Password are not the same");
        }
        // check if the current password and new password are same
        if(request.getNewPassword().equals(request.getCurrentPassword())){
            throw new IllegalStateException("New password shouldn't be the same as current");
        }

        // update the password
        user.setPassword(passwordEncoder.encode(request.getNewPassword()));

        // save the new password
        appUserRepository.save(user);

        return "Your password has been changed";
    }



    public AppUser getUserByEmail(String email){
        return appUserRepository.findByEmail(email)
                .orElseThrow(()-> new AppUserNotFoundException("There is no registered user with this email: "+ email));
    }







}
