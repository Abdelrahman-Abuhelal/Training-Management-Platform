package exalt.training.management.controller;

import exalt.training.management.model.TraineeSkill;
import exalt.training.management.service.TraineeSkillService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/trainee-skills")
@Slf4j
public class TraineeSkillController {



    private final TraineeSkillService traineeSkillService;

    @GetMapping
    @PreAuthorize("hasAnyRole('SUPER_ADMIN')")
    @Operation(summary = "Get All Trainee Skill (Admin Only)" , security =  @SecurityRequirement(name = "loginAuth"))
    public List<TraineeSkill> getAllTraineeSkills() {
        return traineeSkillService.getAllTraineeSkills();
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('SUPER_ADMIN')")
    @Operation(summary = "Add Trainee Skill (Admin Only)" , security =  @SecurityRequirement(name = "loginAuth"))
    public TraineeSkill addTraineeSkill(@RequestBody TraineeSkill traineeSkill) {
        return traineeSkillService.addTraineeSkill(traineeSkill);
    }
}
