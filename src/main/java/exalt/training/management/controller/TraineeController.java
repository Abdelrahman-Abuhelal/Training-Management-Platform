package exalt.training.management.controller;


import exalt.training.management.dto.AppUserDto;
import exalt.training.management.model.Trainee;
import exalt.training.management.service.AdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/trainees")
public class TraineeController {


    private final AdminService adminService;


/*    @PostMapping
    public ResponseEntity<AppUserResponse> registerTrainee(@RequestBody RegistrationRequest traineeRegistrationDto){
        AppUserResponse userResponseDto = traineeRegistrationService.registerTrainee(traineeRegistrationDto);
        return new ResponseEntity<>(userResponseDto, HttpStatus.OK);
    }*/


    @GetMapping("/{id}")
    public ResponseEntity<Trainee> getTraineeById(@PathVariable Long id){
        Trainee trainee = adminService.getTraineeById(id);
        return new ResponseEntity<>(trainee, HttpStatus.OK);
    }

    @GetMapping
    public ResponseEntity <List<Trainee>> getAllTrainees(){
        List <Trainee> trainees = adminService.getAllTrainees();
        return new ResponseEntity<>(trainees, HttpStatus.OK);
    }

/*    @DeleteMapping("/{username}")
    public ResponseEntity<String> deleteTraineeByUsername(@PathVariable String username){
        adminService.deleteTraineeByUsername(username);
        return ResponseEntity.ok("Deleted Trainee");
    }*/

}