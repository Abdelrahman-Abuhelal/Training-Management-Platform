package exalt.training.management.controller;


import exalt.training.management.dto.FormDataDto;
import exalt.training.management.dto.TraineeDataDto;
import exalt.training.management.model.users.Trainee;
import exalt.training.management.service.FormService;
import exalt.training.management.service.TraineeService;
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

    private final FormService reviewService;

    @PutMapping("/update-me")
    @PreAuthorize("hasAnyRole('TRAINEE')")
    @Operation(summary = "Register Trainee Data" , security =  @SecurityRequirement(name = "loginAuth"))
    public ResponseEntity<String> registerTraineeData(@RequestBody TraineeDataDto traineeDataDTO) {
        return ResponseEntity.ok(traineeService.registerTraineeData(traineeDataDTO));
    }



    @Operation(summary = "Get Trainee By Id", security =  @SecurityRequirement(name = "loginAuth"))
    @PreAuthorize("hasAnyRole('TRAINEE')")
    @GetMapping("/my-profile")
    public ResponseEntity<Trainee> getTraineeProfile(){
        Trainee trainee = traineeService.getMyProfileInfo();
        return new ResponseEntity<>(trainee, HttpStatus.OK);
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