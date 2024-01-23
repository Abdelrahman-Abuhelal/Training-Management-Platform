package exalt.training.management.service;

import exalt.training.management.dto.ChangePasswordRequest;
import exalt.training.management.dto.ConfirmedAccountResponse;
import exalt.training.management.dto.PasswordRequest;
import exalt.training.management.exception.AccountAlreadyActivatedException;
import exalt.training.management.exception.AppUserNotFoundException;
import exalt.training.management.exception.UserAlreadyExistsException;
import exalt.training.management.mapper.AppUserMapper;
import exalt.training.management.model.AppUser;
import exalt.training.management.model.AppUserRole;
import exalt.training.management.model.Trainee;
import exalt.training.management.repository.AppUserRepository;
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


    public ConfirmedAccountResponse confirmAccount(String userEmail, PasswordRequest passwordRequest) {
        ConfirmedAccountResponse confirmedAccountResponse=new ConfirmedAccountResponse();
        AppUser user = appUserRepository.findByEmail(userEmail).orElseThrow(
                () -> new AppUserNotFoundException("User not found with this token")
        );
        if(user.getEnabled()){
            throw new AccountAlreadyActivatedException("Account is activated before");
        }
        String newPass =passwordRequest.getNewPassword();
        String confirmationPass=passwordRequest.getConfirmationPassword();
        if(!newPass.equals(confirmationPass)){
            throw new IllegalStateException("Passwords are not the same");
        }
        user.setPassword(passwordEncoder.encode(newPass));
        user.setEnabled(true);
        appUserRepository.save(user);
        // This logic could be done in the appUserService
        if (user.getRole().equals(AppUserRole.TRAINEE)){
            Trainee trainee=new Trainee();
            user.setTrainee(trainee);
            trainee.setUser(user);
            traineeService.saveTrainee(trainee);
        }
        appUserRepository.save(user);
        confirmedAccountResponse.setStatus("ACTIVE");
        confirmedAccountResponse.setMessage("Account has been activated");
        log.info(user.getFirstName()+" account has been activated (ACTIVE)");
        return confirmedAccountResponse;
    }


/*    public void saveUser(AppUser user){
        if (user.getRole().equals(AppUserRole.TRAINEE)){
            traineeService.saveTrainee(user.getId());
        }
    }*/

/*    public String registerUser(RegistrationRequest request) {
        if (appUserService.userAlreadyExists(request.getEmail())){
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
        authenticationService.saveUserConfirmationToken(savedUser, jwtToken);
        if(tokenService.isTokenValid(jwtToken,savedUser)){
            authenticationService.sendAccountConfirmationEmail(user,tokenService.findByToken(jwtToken));
        }
        log.info("account need verification (NOT ACTIVE)");
        // Should better return a json object
        return "Verify your account by the link sent into your email address: " +user.getEmail();
    }*/

    public boolean userAlreadyExists(String username){
        return appUserRepository.findByEmail(username).isPresent();
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
        return appUserRepository.findByEmail(email).orElseThrow(()-> new AppUserNotFoundException("There is no registered user with this email: "+ email));
    }







}
