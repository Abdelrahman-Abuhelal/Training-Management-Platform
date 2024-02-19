package exalt.training.management.controller;

import exalt.training.management.dto.AppUserDto;
import exalt.training.management.dto.AppUserRequestDto;
import exalt.training.management.dto.CreatedUserResponse;
import exalt.training.management.dto.UserCreationRequest;
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

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/admin")
public class AdminController {


    private final AdminService adminService;
    private final AcademicGradesService academicGradesService;

    @Operation(summary = "Create Any type of User (SUPER_ADMIN, SUPERVISOR, or TRAINEE)", security =  @SecurityRequirement(name = "apiKey"))
    @PostMapping("/create-user")
    public ResponseEntity<String> createUser(@RequestBody @Valid UserCreationRequest request) {
        return ResponseEntity.ok(adminService.createUser(request));
    }


    @Operation(summary = "Deactivate User", security =  @SecurityRequirement(name = "loginAuth"))
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    @PutMapping("/users/{id}/deactivate")
    public ResponseEntity<String> deactivateUser(@PathVariable Long id)  {
        return ResponseEntity.ok(adminService.deactivateUser(id));
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

    @Operation(summary = "Get Trainee By Id", security =  @SecurityRequirement(name = "loginAuth"))
    @PreAuthorize("hasAnyRole('SUPER_ADMIN','SUPERVISOR')")
    @GetMapping("/trainees/{id}")
    public ResponseEntity<Trainee> getTraineeProfileInfoById(@PathVariable Long id){
        Trainee trainee = adminService.getTraineeById(id);
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


    @Operation(summary = "Get All Academic Grades", security =  @SecurityRequirement(name = "loginAuth"))
    @PreAuthorize("hasAnyRole('SUPER_ADMIN','SUPERVISOR')")
    @PostMapping ("/trainees/{trainee_id}/grades")
    public ResponseEntity<List<AcademicGrades>> saveAcademicGrades(@PathVariable String trainee_id) {
        List <AcademicGrades> academicGrades =academicGradesService.getAllAcademicGrades();
        return new ResponseEntity<>(academicGrades, HttpStatus.OK);
    }

}
