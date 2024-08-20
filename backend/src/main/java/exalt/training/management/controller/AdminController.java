package exalt.training.management.controller;

import exalt.training.management.dto.*;
import exalt.training.management.model.AcademicGrades;
import exalt.training.management.model.users.AppUser;
import exalt.training.management.model.users.Trainee;
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

    @Operation(summary = "Create User, Using Secret Header API only ", security =  @SecurityRequirement(name = "apiKey"))
    @PostMapping("/create-user-secret")
    public ResponseEntity<String> createUserSecret(@RequestBody @Valid UserCreationRequest request) {
        return ResponseEntity.ok(adminService.createUserSecret(request));
    }
    @Operation(summary = "Get needed trainee data for job hunt", security =  @SecurityRequirement(name = "loginAuth"))
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    @GetMapping("/trainee-job-data")
    public ResponseEntity<List<TraineeInfoForJobDto>> getAllTraineesInfoForJob(){
        List<TraineeInfoForJobDto> traineeInfoForJobDtos= adminService.getAllTraineesInfoForJob();
        return new ResponseEntity<>(traineeInfoForJobDtos, HttpStatus.OK);
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

    @Operation(summary = "Update User using his Id", security =  @SecurityRequirement(name = "loginAuth"))
    @PreAuthorize("hasAnyRole('SUPER_ADMIN')")
    @PutMapping("/users/{id}")
    public ResponseEntity<String> updateUserDetails(@PathVariable Long id
            ,@RequestBody AppUserRequestDto appUserRequestDto){
        String message = adminService.updateUserById(id,appUserRequestDto);
        return new ResponseEntity<>(message, HttpStatus.OK);
    }

    @Operation(summary = "Get All Activated Users", security =  @SecurityRequirement(name = "loginAuth"))
    @PreAuthorize("hasAnyRole('SUPER_ADMIN','SUPERVISOR')")
    @GetMapping("/users")
    public ResponseEntity<List<AppUserDto>> getAllActivatedUsers(){
        List<AppUserDto> userList= adminService.getAllActivatedUsers();
        return new ResponseEntity<>(userList, HttpStatus.OK);
    }

    @Operation(summary = "Get All Users (activated and not activated)", security =  @SecurityRequirement(name = "loginAuth"))
    @PreAuthorize("hasAnyRole('SUPER_ADMIN','SUPERVISOR')")
    @GetMapping("/all-users")
    public ResponseEntity<List<AppUserDto>> getAllUsers(){
        List<AppUserDto> userList= adminService.getAllUsers();
        return new ResponseEntity<>(userList, HttpStatus.OK);
    }

    @Operation(summary = "Get User By Id", security =  @SecurityRequirement(name = "loginAuth"))
    @PreAuthorize("hasAnyRole('SUPER_ADMIN','SUPERVISOR')")
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
    @Operation(summary = "Assign trainees to Supervisors", security =  @SecurityRequirement(name = "loginAuth"))
    @PreAuthorize("hasAnyRole('SUPER_ADMIN')")
    @PutMapping("/assign-trainees")
    public ResponseEntity<String> assignSupervisorsToTrainees(@RequestBody AssignRequest assignRequest) {
        adminService.assignSupervisorsToTrainees(assignRequest.getSupervisorIds(), assignRequest.getTraineeIds());
        String message= "Supervisors assigned to trainees successfully";
        return new ResponseEntity<>(message, HttpStatus.OK);
    }

    @Operation(summary = "Get Supervisor User IDs for a Trainee User ID", security =  @SecurityRequirement(name = "loginAuth"))
    @PreAuthorize("hasAnyRole('SUPER_ADMIN')")
    @GetMapping("/supervisorsUserIds/{userId}")
    public ResponseEntity <List<Long>> getSupervisorsUserIdsByForTrainee(@PathVariable Long userId) {
        List <Long> SupervisorUserIds = adminService.getSupervisorsUserIdsByTraineeUserId(userId);
        return new ResponseEntity<>(SupervisorUserIds, HttpStatus.OK);
    }




    @PutMapping("/update-trainee/{userId}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN','SUPERVISOR')")
    @Operation(summary = "Update Trainee Data" , security =  @SecurityRequirement(name = "loginAuth"))
    public ResponseEntity<String> updateTraineeData(@RequestBody TraineeDataDto traineeDataDTO, @PathVariable Long userId) {
        return ResponseEntity.ok(adminService.updateTraineeData(traineeDataDTO,userId));
    }


    @Operation(summary = "Get Trainee Profile By Id", security =  @SecurityRequirement(name = "loginAuth"))
    @PreAuthorize("hasAnyRole('SUPER_ADMIN','SUPERVISOR')")
    @GetMapping("/trainees/{id}")
    public ResponseEntity<Trainee> getTraineeProfileInfoByTraineeId(@PathVariable Long id){
        Trainee trainee = adminService.getTraineeById(id);
        return new ResponseEntity<>(trainee, HttpStatus.OK);
    }

    @Operation(summary = "Get Trainee Information By User Id", security =  @SecurityRequirement(name = "loginAuth"))
    @PreAuthorize("hasAnyRole('SUPER_ADMIN','SUPERVISOR')")
    @GetMapping("/trainee-info/{userId}")
    public ResponseEntity<TraineeDataDto> getTraineeProfileInfoByUserId(@PathVariable Long userId){
        TraineeDataDto trainee = adminService.getTraineeInfoByUserId(userId);
        return new ResponseEntity<>(trainee, HttpStatus.OK);
    }

    @Operation(summary = "Get All Trainees Information", security =  @SecurityRequirement(name = "loginAuth"))
    @PreAuthorize("hasAnyRole('SUPER_ADMIN','SUPERVISOR')")
    @GetMapping("/trainees-info")
    public ResponseEntity <List<TraineeDataDto>> getAllTraineesInfo(){
        List <TraineeDataDto> trainees = adminService.getAllTraineesInfo();
        return new ResponseEntity<>(trainees, HttpStatus.OK);
    }

    @Operation(summary = "Get the number of active superAdmins", security =  @SecurityRequirement(name = "loginAuth"))
    @PreAuthorize("hasAnyRole('SUPER_ADMIN')")
    @GetMapping ("/super-admins/size")
    public ResponseEntity<Integer> getNumberOfActiveSuperAdmins() {
        return ResponseEntity.ok(adminService.getNumberOfActiveSuperAdmins());
    }


    @Operation(summary = "Get the number of active supervisors", security =  @SecurityRequirement(name = "loginAuth"))
    @PreAuthorize("hasAnyRole('SUPER_ADMIN')")
    @GetMapping ("/supervisors/size")
    public ResponseEntity<Integer> getNumberOfActiveSupervisors() {
        return ResponseEntity.ok(adminService.getNumberOfActiveSupervisors());
    }

    @Operation(summary = "Get the number of active trainees", security =  @SecurityRequirement(name = "loginAuth"))
    @PreAuthorize("hasAnyRole('SUPER_ADMIN')")
    @GetMapping ("/trainees/size")
    public ResponseEntity<Integer> getNumberOfActiveTrainees() {
        return ResponseEntity.ok(adminService.getNumberOfActiveTrainees());
    }

}
