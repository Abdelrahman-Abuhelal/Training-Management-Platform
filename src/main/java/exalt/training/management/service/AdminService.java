package exalt.training.management.service;

import exalt.training.management.dto.CreatedUserResponse;
import exalt.training.management.dto.UserCreationRequest;
import exalt.training.management.exception.AppUserNotFoundException;
import exalt.training.management.exception.UserAlreadyExistsException;
import exalt.training.management.mapper.AppUserMapper;
import exalt.training.management.model.AppUser;
import exalt.training.management.model.Token;
import exalt.training.management.model.Trainee;
import exalt.training.management.repository.AppUserRepository;
import exalt.training.management.repository.TraineeRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@Slf4j
@RequiredArgsConstructor

public class AdminService {

    private final TraineeRepository traineeRepository;

    private final AppUserRepository appUserRepository;

    private final AppUserService appUserService;

    private final PasswordEncoder passwordEncoder;
    private final TokenService tokenService;

    private final AuthenticationService authenticationService;
    private final EmailService emailService;

    private final AppUserMapper userMapper;




    public CreatedUserResponse createUser(UserCreationRequest request) {
        if (appUserService.userAlreadyExists(request.getEmail())){
            throw new UserAlreadyExistsException(request.getEmail() + " already exists!");
        }
        var user = AppUser.builder()
                .email(request.getEmail())
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .username(request.getUsername())
                .role(request.getRole())
                .enabled(false)
                .build();

        var savedUser = appUserRepository.save(user);
        var jwtConfirmationToken = tokenService.generateToken(user);
        // Would I need to store the refresh token?
        var refreshToken = tokenService.generateRefreshToken(user);
        // Save the token as Confirmation token
        authenticationService.saveUserConfirmationToken(savedUser, jwtConfirmationToken);
        if(tokenService.isTokenValid(jwtConfirmationToken,savedUser)){
            sendCompleteRegistrationEmail(user);
        }
        log.info("account need verification (NOT ACTIVE)");
        // Should better return a json object
        return CreatedUserResponse.builder()
                .confirmationToken(jwtConfirmationToken)
                .refreshToken(refreshToken)
                .message("Account Complete Registration sent to the user email: " +savedUser.getEmail()).build();
    }


    public void sendCompleteRegistrationEmail(AppUser user){
        SimpleMailMessage mailMessage = new SimpleMailMessage();
        mailMessage.setTo(user.getEmail());
        mailMessage.setSubject("[Training Management System] Complete Registration!");
        mailMessage.setText("To confirm your account in the Exalt Training Application, please complete registration here : "
                +"http://localhost:8080/api/v1/user/complete-registration?email="+user.getEmail());
        emailService.sendEmail(mailMessage);

    }
    public String deactivateUser(Long id){
        if(appUserRepository.findById(id).isEmpty()){
            throw new AppUserNotFoundException("There is no user with this ID");
        }
        appUserRepository.findById(id).get().setEnabled(false);
        return "User has been deactivated";
    }
    public AppUser getUserById(Long id){
        return appUserRepository.findById(id).orElseThrow(()-> new AppUserNotFoundException("There is no user with this ID: "+ id));
    }
    public List<AppUser> getAllUsers(){
        List<AppUser>users= appUserRepository.findAll();
        if (users.isEmpty()){
            throw new AppUserNotFoundException("There are no Users in the System");
        }
        return users;
    }

    public Trainee getTraineeById(Long id){
        Optional<Trainee> trainee=traineeRepository.findById(id);
        if (trainee.isEmpty()){
            String message=String.format("the trainee with the id %s  is not found",id);
            log.info(message);
            throw new AppUserNotFoundException(message);
        }
        return trainee.get();
    }


    public List<Trainee> getAllTrainees(){
        List<Trainee> trainees=traineeRepository.findAll();
        if (trainees.isEmpty()){
            String message= "there are no trainees";
            log.info(message);
            throw new AppUserNotFoundException(message);
        }
        return trainees;
    }

/*    public void deleteTraineeByUsername(String username){
        Optional<AppUser> appUser = traineeRepository.findByEmail(username);
        if (appUser.isEmpty()){
            String message=String.format("the trainee with the username %s  is not found",username);
            log.info(message);
            throw new AppUserNotFoundException(message);
        }
        traineeRepository.delete(appUser.get());
        String message=String.format("the trainee with the username %s  is deleted",username);
        log.info(message);
    }*/

}