package exalt.training.management.controller;

import exalt.training.management.dto.TrainingPlanAssignRequestDTO;
import exalt.training.management.dto.TrainingPlanCreateRequestDTO;
import exalt.training.management.dto.TrainingPlanResponseDTO;
import exalt.training.management.model.TrainingPlan;
import exalt.training.management.service.TrainingPlanService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Set;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/trainingPlan")
@Slf4j
public class TrainingPlanController {
    @Autowired
    private TrainingPlanService trainingPlanService;

    @PostMapping
    public TrainingPlanResponseDTO createTrainingPlan(@RequestBody TrainingPlanCreateRequestDTO trainingPlanCreateRequestDTO) {
        return trainingPlanService.createTrainingPlan(trainingPlanCreateRequestDTO);
    }

    @PutMapping("/{planId}/assign")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN','SUPERVISOR')")
    @Operation(summary = "Assign training plan " , security =  @SecurityRequirement(name = "loginAuth"))
    public void assignTrainingPlan(@PathVariable Long planId,@RequestBody TrainingPlanAssignRequestDTO assignmentRequest) {
        trainingPlanService.assignTrainingPlanToTrainees(planId,assignmentRequest);
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('SUPER_ADMIN','SUPERVISOR')")
    @Operation(summary = "Get All training plans " , security =  @SecurityRequirement(name = "loginAuth"))
    public List<TrainingPlanResponseDTO> getAllTrainingPlans() {
        return trainingPlanService.getAllTrainingPlans();
    }

    @GetMapping("/{planId}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN','SUPERVISOR')")
    @Operation(summary = "Get  training plan by id " , security =  @SecurityRequirement(name = "loginAuth"))
    public TrainingPlanResponseDTO getTrainingPlanById(@PathVariable Long planId) {
        return trainingPlanService.getTrainingPlanById(planId);
    }

    @DeleteMapping("/{planId}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN','SUPERVISOR')")
    @Operation(summary = "Delete  training plan by  id " , security =  @SecurityRequirement(name = "loginAuth"))
    public ResponseEntity<Void> deleteTrainingPlan(@PathVariable Long planId) {
        trainingPlanService.deleteTrainingPlan(planId);
        return ResponseEntity.noContent().build(); // Return a 204 No Content response
    }



}
