package exalt.training.management.service;

import exalt.training.management.dto.ChangePasswordRequest;
import exalt.training.management.dto.PasswordRequest;
import exalt.training.management.exception.*;
import exalt.training.management.model.users.AppUser;
import exalt.training.management.model.users.SuperAdmin;
import exalt.training.management.model.users.Supervisor;
import exalt.training.management.model.users.Trainee;
import exalt.training.management.repository.AppUserRepository;
import exalt.training.management.repository.TokenRepository;
import jakarta.servlet.http.HttpServletRequest;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

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

    @Autowired
    public AppUserService(AppUserRepository appUserRepository,
                          @Lazy AuthenticationService authenticationService,
                          PasswordEncoder passwordEncoder,
                          @Lazy TraineeService traineeService,
                          SupervisorService supervisorService,
                          SuperAdminService superAdminService,
                          TokenService tokenService) {
        this.appUserRepository = appUserRepository;
        this.authenticationService = authenticationService;
        this.passwordEncoder = passwordEncoder;
        this.traineeService = traineeService;
        this.supervisorService = supervisorService;
        this.superAdminService = superAdminService;
        this.tokenService = tokenService;
    }


    public String confirmAccount(HttpServletRequest request,PasswordRequest passwordRequest) {
        final String confirmAccountJwt = authenticationService.checkAuthHeader(request);
        final String userEmail;
        userEmail = tokenService.extractEmail(confirmAccountJwt);
        log.info(userEmail+" is trying to activate his account");
        AppUser user=getUserByEmail(userEmail);
        var isTokenValid = tokenService.isConfirmationTokenValid(confirmAccountJwt);
        if (!(tokenService.isTokenValid(confirmAccountJwt, user) && isTokenValid)){
            throw new InvalidTokenException("token is not valid");
        }
        if(user.getActivated()){
            throw new AccountAlreadyActivatedException("Account is already activated before");
        }
        String newPass =passwordRequest.getNewPassword();
        String confirmationPass=passwordRequest.getConfirmationPassword();
        authenticationService.checkValidPasswordMatch(newPass,confirmationPass);
        user.setPassword(passwordEncoder.encode(newPass));
        user.setActivated(true);
        user.setVerified(true);
        saveUser(user);
        log.info(user.getFirstName()+" account has been activated (ACTIVE)");
        return "Account has been activated";
    }
    public List<AppUser> getAllActivatedUsers() {
        return appUserRepository.findByActivatedTrue();
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


    public String changePassword(ChangePasswordRequest request) {
// i want to get the user from the token

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        var user = (AppUser) authentication.getPrincipal();

        // check if the current password is correct
        if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPassword())) {
            throw new IllegalStateException("Wrong current password");
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
                .orElseThrow(()-> new AppUserNotFoundException("There is no registered user with this email"));
    }

    public Boolean usernameIsNotUnique(String username){
        return appUserRepository.existsByUsername(username);
    }







}
