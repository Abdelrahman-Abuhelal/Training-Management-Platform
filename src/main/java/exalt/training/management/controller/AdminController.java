package exalt.training.management.controller;

import exalt.training.management.dto.*;
import exalt.training.management.model.AcademicGrades;
import exalt.training.management.model.AppUser;
import exalt.training.management.model.Trainee;
import exalt.training.management.service.AcademicGradesService;
import exalt.training.management.service.AdminService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/admin")
public class AdminController {


    private final AdminService adminService;
    private final AcademicGradesService academicGradesService;

    @Operation(summary = "Create User, Secret API (SUPER_ADMIN, SUPERVISOR, or TRAINEE)", security =  @SecurityRequirement(name = "apiKey"))
    @PostMapping("/create-user-secret")
    public ResponseEntity<String> createUserSecret(@RequestBody @Valid UserCreationRequest request) {
        return ResponseEntity.ok(adminService.createUserSecret(request));
    }


    @Operation(summary = "Create Any type of User for admin only", security =  @SecurityRequirement(name = "loginAuth"))
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    @PostMapping("/create-user")
    public ResponseEntity<String> createUserInAdminPortal(@RequestBody @Valid UserCreationRequest request) {
        return ResponseEntity.ok(adminService.createUserSecret(request));
    }


    @Operation(summary = "Deactivate User", security =  @SecurityRequirement(name = "loginAuth"))
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    @PutMapping("/users/{id}/deactivate")
    public ResponseEntity<String> deactivateUser(@PathVariable Long id)  {
        return ResponseEntity.ok(adminService.deactivateUser(id));
    }

    @Operation(summary = "Delete User", security =  @SecurityRequirement(name = "loginAuth"))
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    @DeleteMapping("/users/{id}")
    public ResponseEntity<String> deleteUser(@PathVariable Long id)  {
        return ResponseEntity.ok(adminService.deleteUser(id));
    }


    @Operation(summary = "Get All Users", security =  @SecurityRequirement(name = "loginAuth"))
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    @GetMapping("/users")
    public ResponseEntity<List<AppUserDto>> getAllUsers(){
        List<AppUserDto> userList= adminService.getAllUsers();
        return new ResponseEntity<>(userList, HttpStatus.OK);
    }

    @Operation(summary = "Get User By Id", security =  @SecurityRequirement(name = "loginAuth"))
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    @GetMapping("/users/{id}")
    public ResponseEntity<AppUserDto> getUserById(@PathVariable Long id){
        AppUserDto appUserDto= adminService.getUserById(id);
        return new ResponseEntity<>(appUserDto, HttpStatus.OK);
    }

    @Operation(summary = "Get All info for User By Id", security =  @SecurityRequirement(name = "loginAuth"))
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    @GetMapping("/users/{id}/all-info")
    public ResponseEntity<AppUser> getUserInfoById(@PathVariable Long id){
        AppUser appUser= adminService.getFullUserById(id);
        return new ResponseEntity<>(appUser, HttpStatus.OK);
    }

    @Operation(summary = "Update User using his Id", security =  @SecurityRequirement(name = "loginAuth"))
    @PreAuthorize("hasAnyRole('SUPER_ADMIN','SUPERVISOR')")
    @PutMapping("/users/{id}")
    public ResponseEntity<String> updateUserDetails(@PathVariable Long id
            ,@RequestBody AppUserRequestDto appUserRequestDto){
        String message = adminService.updateUserById(id,appUserRequestDto);
        return new ResponseEntity<>(message, HttpStatus.OK);
    }


    @PutMapping("/update-trainee/{userId}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN','SUPERVISOR')")
    @Operation(summary = "Update Trainee Data" , security =  @SecurityRequirement(name = "loginAuth"))
    public ResponseEntity<String> updateTraineeData(@RequestBody TraineeDataDto traineeDataDTO, @PathVariable Long userId) {
        return ResponseEntity.ok(adminService.updateTraineeData(traineeDataDTO,userId));
    }


    @Operation(summary = "Get Trainee By Id", security =  @SecurityRequirement(name = "loginAuth"))
    @PreAuthorize("hasAnyRole('SUPER_ADMIN','SUPERVISOR')")
    @GetMapping("/trainees/{id}")
    public ResponseEntity<Trainee> getTraineeProfileInfoByTraineeId(@PathVariable Long id){
        Trainee trainee = adminService.getTraineeById(id);
        return new ResponseEntity<>(trainee, HttpStatus.OK);
    }

    @Operation(summary = "Get Trainee By User Id", security =  @SecurityRequirement(name = "loginAuth"))
    @PreAuthorize("hasAnyRole('SUPER_ADMIN','SUPERVISOR')")
    @GetMapping("/trainee-info/{userId}")
    public ResponseEntity<Trainee> getTraineeProfileInfoByUserId(@PathVariable Long userId){
        Trainee trainee = adminService.getTraineeByUserId(userId);
        return new ResponseEntity<>(trainee, HttpStatus.OK);
    }

    @Operation(summary = "Get All Trainees", security =  @SecurityRequirement(name = "loginAuth"))
    @PreAuthorize("hasAnyRole('SUPER_ADMIN','SUPERVISOR')")
    @GetMapping("/trainees")
    public ResponseEntity <List<Trainee>> getAllTrainees(){
        List <Trainee> trainees = adminService.getAllTrainees();
        return new ResponseEntity<>(trainees, HttpStatus.OK);
    }


    // Should add authorization to this endpoint for only SUPER_ADMIN
    @Operation(summary = "Get All Academic Grades", security =  @SecurityRequirement(name = "loginAuth"))
    @PreAuthorize("hasAnyRole('SUPER_ADMIN','SUPERVISOR')")
    @GetMapping("/trainees/grades/all")
    public ResponseEntity<List<AcademicGrades>> getAllAcademicGrades() {
        List <AcademicGrades> academicGrades =  academicGradesService.getAllAcademicGrades();
        return new ResponseEntity<>(academicGrades, HttpStatus.OK);
    }


    @Operation(summary = "Save Academic Grades for a trainee using UserId", security =  @SecurityRequirement(name = "loginAuth"))
    @PreAuthorize("hasAnyRole('SUPER_ADMIN','SUPERVISOR')")
    @PutMapping ("/trainees/{userId}/grades")
    public ResponseEntity<String> saveAcademicGradesToTrainee(@RequestBody Map<String, Double> grades, @PathVariable Long userId) {
        return ResponseEntity.ok(adminService.saveAcademicGradesToTrainee(grades, userId));
    }

}
