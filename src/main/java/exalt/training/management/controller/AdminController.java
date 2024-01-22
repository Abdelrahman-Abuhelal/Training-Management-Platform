package exalt.training.management.controller;

import exalt.training.management.dto.CreatedUserResponse;
import exalt.training.management.dto.UserCreationRequest;
import exalt.training.management.model.AppUser;
import exalt.training.management.service.AdminService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/admins")
public class AdminController {


    private final AdminService adminService;


    @PostMapping("/create-user")
    public ResponseEntity<CreatedUserResponse> createUser(@RequestBody @Valid UserCreationRequest request) {
        return ResponseEntity.ok(adminService.createUser(request));
    }



    @PutMapping("/users/deactivate/{id}")
    public ResponseEntity<String> deactivateUser(@PathVariable Long id)  {
        return ResponseEntity.ok(adminService.deactivateUser(id));
    }


    @GetMapping("/users")
    public ResponseEntity<List<AppUser>> getAllUsers(){
        List<AppUser> userList= adminService.getAllUsers();
        return new ResponseEntity<>(userList, HttpStatus.OK);
    }


    @GetMapping("/users/{id}")
    public ResponseEntity<AppUser> getUserById(@PathVariable Long id){
        AppUser appUser= adminService.getUserById(id);
        return new ResponseEntity<>(appUser, HttpStatus.OK);
    }
}
