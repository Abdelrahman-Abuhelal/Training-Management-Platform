package exalt.training.management.controller;


import exalt.training.management.dto.SkillDto;
import exalt.training.management.model.Skill;
import exalt.training.management.service.SkillService;
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
@RequestMapping("/api/v1/skills")
@Slf4j
public class SkillController {

    private final SkillService skillService;
    private final TraineeSkillService traineeSkillService;

    @GetMapping
    @PreAuthorize("hasAnyRole('SUPER_ADMIN','SUPERVISOR')")
    @Operation(summary = "Get All Skills (Admin And Supervisor)" , security =  @SecurityRequirement(name = "loginAuth"))
    public List<Skill> getAllSkills() {
        return skillService.getAllSkills();
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('SUPER_ADMIN')")
    @Operation(summary = "Add new Skill (Admin Only)" , security =  @SecurityRequirement(name = "loginAuth"))
    public String addSkill(@RequestBody SkillDto skillDto) {
        return skillService.addSkill(skillDto);
    }

    @DeleteMapping("/{skillId}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN')")
    @Operation(summary = "Delete Skill (Admin Only)" , security =  @SecurityRequirement(name = "loginAuth"))
    public String deleteSkill(@PathVariable Long skillId) {
        return skillService.deleteSkill(skillId);
    }
}