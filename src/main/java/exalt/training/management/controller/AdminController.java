package exalt.training.management.controller;

import exalt.training.management.dto.CreatedUserResponse;
import exalt.training.management.dto.UserCreationRequest;
import exalt.training.management.model.AppUser;
import exalt.training.management.model.Trainee;
import exalt.training.management.service.AdminService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/admin")
public class AdminController {


    private final AdminService adminService;


    @PostMapping("/create-user")
    public ResponseEntity<CreatedUserResponse> createUser(@RequestBody @Valid UserCreationRequest request) {
        return ResponseEntity.ok(adminService.createUser(request));
    }

    @PreAuthorize("hasRole('SUPER_ADMIN')")
    @PutMapping("/users/deactivate/{id}")
    public ResponseEntity<String> deactivateUser(@PathVariable Long id)  {
        return ResponseEntity.ok(adminService.deactivateUser(id));
    }

    @PreAuthorize("hasRole('SUPER_ADMIN')")
    @GetMapping("/users")
    public ResponseEntity<List<AppUser>> getAllUsers(){
        List<AppUser> userList= adminService.getAllUsers();
        return new ResponseEntity<>(userList, HttpStatus.OK);
    }

    @PreAuthorize("hasRole('SUPER_ADMIN')")
    @GetMapping("/users/{id}")
    public ResponseEntity<AppUser> getUserById(@PathVariable Long id){
        AppUser appUser= adminService.getUserById(id);
        return new ResponseEntity<>(appUser, HttpStatus.OK);
    }

    @PreAuthorize("hasAnyRole('SUPER_ADMIN','SUPERVISOR')")
    @GetMapping("/trainees/{id}")
    public ResponseEntity<Trainee> getTraineeById(@PathVariable Long id){
        Trainee trainee = adminService.getTraineeById(id);
        return new ResponseEntity<>(trainee, HttpStatus.OK);
    }

    @PreAuthorize("hasAnyRole('SUPER_ADMIN','SUPERVISOR')")
    @GetMapping("/trainees")
    public ResponseEntity <List<Trainee>> getAllTrainees(){
        List <Trainee> trainees = adminService.getAllTrainees();
        return new ResponseEntity<>(trainees, HttpStatus.OK);
    }

}
