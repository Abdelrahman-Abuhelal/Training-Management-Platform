package exalt.training.management.controller;

import exalt.training.management.dto.SkillProficiencyDTO;
import exalt.training.management.dto.TraineeSkillDTO;
import exalt.training.management.dto.TraineeSkillsResponseDTO;
import exalt.training.management.model.TraineeSkill;
import exalt.training.management.service.TraineeSkillService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/trainee-skills")
@Slf4j
public class TraineeSkillController {



    private final TraineeSkillService traineeSkillService;

//    @GetMapping("/{userId}")
//    @PreAuthorize("hasAnyRole('SUPER_ADMIN','SUPERVISOR')")
//    @Operation(summary = "Get All Trainee Skill " , security =  @SecurityRequirement(name = "loginAuth"))
//    public List<SkillProficiencyDTO> getAllTraineeSkills(@PathVariable Long userId) {
//        return traineeSkillService.getTraineeSkills(userId);
//    }

    @PostMapping("/{userId}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN','SUPERVISOR')")
    @Operation(summary = "Save Trainee Skill " , security =  @SecurityRequirement(name = "loginAuth"))
    public ResponseEntity<String> saveTraineeSkill(@RequestBody TraineeSkillDTO traineeSkillDTO, @PathVariable Long userId) {
        return ResponseEntity.ok(traineeSkillService.saveTraineeSkills(traineeSkillDTO,userId));
    }

    @DeleteMapping("/{userId}/{skillId}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN','SUPERVISOR')")
    @Operation(summary = "Save Trainee Skill " , security =  @SecurityRequirement(name = "loginAuth"))
    public ResponseEntity<String> deleteTraineeSkill(@PathVariable Long userId, @PathVariable  Long skillId) {
        return ResponseEntity.ok(traineeSkillService.deleteTraineeSkill(userId, skillId));
    }

    @GetMapping("/{userId}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN','SUPERVISOR')")
    @Operation(summary = "View Trainee Skills with trainee name " , security =  @SecurityRequirement(name = "loginAuth"))
    public ResponseEntity<TraineeSkillsResponseDTO> getTraineeSkills(@PathVariable Long userId) {
        TraineeSkillsResponseDTO responseDTO = traineeSkillService.viewTraineeSkills(userId);
        return ResponseEntity.ok(responseDTO);
    }


    @GetMapping("/mine")
    @PreAuthorize("hasAnyRole('SUPERVISOR')")
    @Operation(summary = "Get All My Trainees Skills'" , security =  @SecurityRequirement(name = "loginAuth"))
    public ResponseEntity<List<TraineeSkillsResponseDTO>> getMyTraineesSkills() {
        List<TraineeSkillsResponseDTO> responseDTOs = traineeSkillService.getMyTraineesSkills();
        return ResponseEntity.ok(responseDTOs);
    }

    @GetMapping("/all")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN')")
    @Operation(summary = "View All Trainees names with their Skills'" , security =  @SecurityRequirement(name = "loginAuth"))
    public ResponseEntity<List<TraineeSkillsResponseDTO>> getAllTraineesWithSkills() {
        List<TraineeSkillsResponseDTO> responseDTOs = traineeSkillService.getAllTraineesWithSkills();
        return ResponseEntity.ok(responseDTOs);
    }




}
