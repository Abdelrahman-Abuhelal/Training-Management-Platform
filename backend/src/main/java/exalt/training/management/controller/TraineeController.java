package exalt.training.management.controller;


import exalt.training.management.dto.*;
import exalt.training.management.model.AcademicGrades;
import exalt.training.management.model.users.Trainee;
import exalt.training.management.service.*;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/trainee-operations")
public class TraineeController {


    private final TraineeService traineeService;
    private final AcademicGradesService academicGradesService;

    private final TrainingPlanService trainingPlanService;
    private final ResourceService resourceService;


    @PutMapping("/update-me")
    @PreAuthorize("hasAnyRole('TRAINEE')")
    @Operation(summary = "Register Trainee Data" , security =  @SecurityRequirement(name = "loginAuth"))
    public ResponseEntity<String> registerTraineeData(@RequestBody TraineeDataDto traineeDataDTO) {
        return ResponseEntity.ok(traineeService.registerTraineeData(traineeDataDTO));
    }



    @Operation(summary = "Get Trainee By Id", security =  @SecurityRequirement(name = "loginAuth"))
    @PreAuthorize("hasAnyRole('TRAINEE')")
    @GetMapping("/my-profile")
    public ResponseEntity<TraineeDataDto> getTraineeProfile(){
        TraineeDataDto trainee = traineeService.getMyProfileInfo();
        return new ResponseEntity<>(trainee, HttpStatus.OK);
    }

    @PreAuthorize("hasAnyRole('TRAINEE')")
    @Operation(summary = "Get My Academic Grades", security = @SecurityRequirement(name = "loginAuth"))
    @GetMapping("/my-grades")
    public ResponseEntity<List<AcademicGrades>> getAcademicGradesForTrainee() {
        try {
            List<AcademicGrades> academicGrades = academicGradesService.getMyAcademicGrades();
            return new ResponseEntity<>(academicGrades, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }


    @GetMapping("/my-plans")
    @PreAuthorize("hasAnyRole('TRAINEE')")
    @Operation(summary = "Get My Training Plans" , security =  @SecurityRequirement(name = "loginAuth"))
    public ResponseEntity <List<TrainingPlanDto>> getMyTrainingPlans() {
        return ResponseEntity.ok(trainingPlanService.getMyTrainingPlans());
    }

    @GetMapping("/my-resources")
    @PreAuthorize("hasAnyRole('TRAINEE')")
    @Operation(summary = "Get My Resources" , security =  @SecurityRequirement(name = "loginAuth"))
    public ResponseEntity <List<ResourceDto>> getMyResources() {
        return ResponseEntity.ok(resourceService.getMyResources());
    }

//    @GetMapping("/my-forms")
//    @PreAuthorize("hasAnyRole('TRAINEE')")
//    @Operation(summary = "Get All Forms (Trainee Only)" , security =  @SecurityRequirement(name = "loginAuth"))
//    public ResponseEntity <List<FormDataDto>> getAllTraineeForms() {
//        return ResponseEntity.ok(reviewService.getAllForms());
//    }

/*    @DeleteMapping("/{username}")
    public ResponseEntity<String> deleteTraineeByUsername(@PathVariable String username){
        adminService.deleteTraineeByUsername(username);
        return ResponseEntity.ok("Deleted Trainee");
    }*/

}