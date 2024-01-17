package exalt.training.management.service;

import exalt.training.management.dto.AppUserDto;
import exalt.training.management.dto.ChangePasswordRequest;
import exalt.training.management.exception.AppUserNotFoundException;
import exalt.training.management.mapper.AppUserMapper;
import exalt.training.management.model.AppUser;
import exalt.training.management.model.AppUserRole;
import exalt.training.management.repository.AppUserRepository;
import exalt.training.management.repository.TraineeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.security.Principal;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AppUserService {

    private final AppUserRepository appUserRepository;
    private final AppUserMapper appUserMapper;
    private final PasswordEncoder passwordEncoder;
    private final TraineeRepository traineeRepository;
    private final TraineeService traineeService;

/*    public void saveUser(AppUser user){
        if (user.getRole().equals(AppUserRole.TRAINEE)){
            traineeService.saveTrainee(user.getId());
        }
    }*/

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

    public AppUserDto getUserById(Long id){
        AppUser appUser = appUserRepository.findById(id).orElseThrow(()-> new AppUserNotFoundException("There is no user with this ID: "+ id));
        return appUserMapper.userToUserDto(appUser);
    }

    public AppUser getUserByEmail(String email){
        AppUser appUser = appUserRepository.findByEmail(email).orElseThrow(()-> new AppUserNotFoundException("There is no registered user with this email: "+ email));
        return appUser;
    }

    public List<AppUserDto> getAllUsers(){
        List<AppUser>users= appUserRepository.findAll();
        if (users.isEmpty()){
            throw new AppUserNotFoundException("There are no Users in the System");
        }
        return appUserMapper.userToUserDto(users);
    }





}
