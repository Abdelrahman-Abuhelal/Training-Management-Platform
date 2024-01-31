package exalt.training.management.controller;


import exalt.training.management.dto.TraineeDataDto;
import exalt.training.management.service.TraineeService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.security.Principal;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/trainee-operations")
public class TraineeController {


    private final TraineeService traineeService;


    @PutMapping("/update-me")
    @PreAuthorize("hasAnyRole('TRAINEE')")
    public ResponseEntity<String> registerTraineeData(
            @RequestBody @Valid TraineeDataDto traineeDataDTO, Principal user) {
        return ResponseEntity.ok(traineeService.registerTraineeData(traineeDataDTO, user));
    }


/*    @DeleteMapping("/{username}")
    public ResponseEntity<String> deleteTraineeByUsername(@PathVariable String username){
        adminService.deleteTraineeByUsername(username);
        return ResponseEntity.ok("Deleted Trainee");
    }*/

}