package exalt.training.management.controller;

import exalt.training.management.dto.*;
import exalt.training.management.model.TraineeTask;
import exalt.training.management.model.users.Trainee;
import exalt.training.management.service.SupervisorService;
import exalt.training.management.service.TaskService;
import exalt.training.management.service.TraineeService;
import exalt.training.management.service.TrainingPlanService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/supervisor")
public class SupervisorController {


    private final SupervisorService supervisorService;
    private final TaskService taskService;
    private final TrainingPlanService trainingPlanService;

    @GetMapping( "/my-trainees")
    @PreAuthorize("hasRole('SUPERVISOR')")
    @Operation(summary = "Get Supervisor's Trainees By login token" , security =  @SecurityRequirement(name = "loginAuth"))
    public ResponseEntity <List<AppUserDto>> getMyTrainees() {
        List<AppUserDto> trainees = supervisorService.getMyTrainees();
        return ResponseEntity.ok(trainees);
    }

    @GetMapping( "/{userId}/trainees")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN','SUPERVISOR')")
    @Operation(summary = "Get Supervisor's Trainees by ID " , security =  @SecurityRequirement(name = "loginAuth"))
    public ResponseEntity <List<AppUserDto>> getSupervisorTrainees(@PathVariable Long userId) {
        try {
            List<AppUserDto> trainees = supervisorService.getSupervisorTrainees(userId);
            return ResponseEntity.ok(trainees);
        } catch (Exception e) {
        log.error("Error getting supervisor trainees", e);
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
    }

}

    @GetMapping( "/assigned-tasks")
    @PreAuthorize("hasAnyRole('SUPERVISOR')")
    @Operation(summary = "Get Supervisor's Assigned Tasks " , security =  @SecurityRequirement(name = "loginAuth"))
    public ResponseEntity<List<TaskDto>> getTasksAssignedBySupervisor() {
        List<TaskDto> tasks = taskService.getTasksAssignedBySupervisor();
        return ResponseEntity.ok(tasks);
    }

    @PostMapping("/assignTask")
    @PreAuthorize("hasAnyRole('SUPERVISOR')")
    @Operation(summary = "Assign a task " , security =  @SecurityRequirement(name = "loginAuth"))
    public String assignTask(@RequestBody AssignTaskRequest assignTaskRequest) {
        return taskService.assignTask(assignTaskRequest);
    }


    @GetMapping("/my-plans")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN','SUPERVISOR')")
    @Operation(summary = "Get  training plan for supervisor " , security =  @SecurityRequirement(name = "loginAuth"))
    public List<TrainingPlanResponseDTO> getTrainingPlansBySupervisor() {
        return trainingPlanService.getTrainingPlansBySupervisor();
    }



}
