package exalt.training.management.service;

import exalt.training.management.dto.ChangePasswordRequest;
import exalt.training.management.dto.ConfirmedAccountResponse;
import exalt.training.management.dto.PasswordRequest;
import exalt.training.management.exception.AccountAlreadyActivatedException;
import exalt.training.management.exception.AppUserNotFoundException;
import exalt.training.management.exception.TokenNotFoundException;
import exalt.training.management.exception.UserAlreadyExistsException;
import exalt.training.management.mapper.AppUserMapper;
import exalt.training.management.model.*;
import exalt.training.management.repository.AppUserRepository;
import exalt.training.management.repository.TokenRepository;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.security.Principal;

@Service
@RequiredArgsConstructor
@Slf4j
public class AppUserService {

    private final AppUserRepository appUserRepository;
    private final PasswordEncoder passwordEncoder;
    private final TraineeService traineeService;
    private final SupervisorService supervisorService;
    private final SuperAdminService superAdminService;
    private final TokenService tokenService;




    public boolean userAlreadyExists(String username){
        return appUserRepository.findByEmail(username).isPresent();
    }

    public void handleUserRole(AppUser user) {
        if (user.getRole().equals(AppUserRole.TRAINEE)) {
            Trainee trainee = new Trainee();
            user.setTrainee(trainee);
            trainee.setUser(user);
            traineeService.saveTrainee(trainee);
        } else if (user.getRole().equals(AppUserRole.SUPERVISOR)) {
            Supervisor supervisor = new Supervisor();
            user.setSupervisor(supervisor);
            supervisor.setUser(user);
            supervisorService.saveSupervisor(supervisor);
        } else if (user.getRole().equals(AppUserRole.SUPER_ADMIN)){
            SuperAdmin superAdmin = new SuperAdmin();
            user.setSuperAdmin(superAdmin);
            superAdmin.setUser(user);
            superAdminService.saveSuperAdmin(superAdmin);
        }
    }

    public void saveUser(AppUser appUser){
        handleUserRole(appUser);
        appUserRepository.save(appUser);
    }

    public String changePassword(ChangePasswordRequest request, Principal connectedUser) {

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
