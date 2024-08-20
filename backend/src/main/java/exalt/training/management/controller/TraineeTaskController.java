package exalt.training.management.controller;

import exalt.training.management.dto.AssignTaskRequest;
import exalt.training.management.dto.TraineeTaskDetailDto;
import exalt.training.management.dto.UpdateTaskStatusRequest;
import exalt.training.management.dto.UpdateTraineeTaskStatus;
import exalt.training.management.model.TraineeTask;
import exalt.training.management.service.TaskService;
import exalt.training.management.service.TraineeTaskService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/traineeTasks")
@Slf4j
public class TraineeTaskController {

    @Autowired
    private TraineeTaskService traineeTaskService;
    @Autowired
    private TaskService taskService;

    @GetMapping
    @PreAuthorize("hasAnyRole('SUPER_ADMIN','SUPERVISOR')")
    @Operation(summary = "Get All trainee tasks " , security =  @SecurityRequirement(name = "loginAuth"))
    public List<TraineeTask> getAllTraineeTasks() {
        return traineeTaskService.getAllTraineeTasks();
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN','SUPERVISOR')")
    @Operation(summary = "Get All trainee task by id " , security =  @SecurityRequirement(name = "loginAuth"))
    public TraineeTask getTraineeTaskById(@PathVariable Long id) {
        return traineeTaskService.getTraineeTaskById(id);
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('SUPER_ADMIN','SUPERVISOR')")
    @Operation(summary = "Create trainee task " , security =  @SecurityRequirement(name = "loginAuth"))
    public TraineeTask createTraineeTask(@RequestBody TraineeTask traineeTask) {
        return traineeTaskService.saveTraineeTask(traineeTask);
    }

    @PutMapping("/{traineeTaskId}/status")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN','SUPERVISOR','TRAINEE')")
    @Operation(summary = "Update Task Status" , security =  @SecurityRequirement(name = "loginAuth"))
    public ResponseEntity<?> updateTaskStatus(@PathVariable Long traineeTaskId, @RequestBody UpdateTaskStatusRequest request) {
            traineeTaskService.updateTaskStatus(traineeTaskId, request.getStatus());
            return ResponseEntity.ok("Task status updated successfully");
    }

    @PreAuthorize("hasAnyRole('SUPER_ADMIN','SUPERVISOR')")
    @GetMapping("/trainees/{traineeId}")
    @Operation(summary = "Get Assigned Tasks for a trainee" , security =  @SecurityRequirement(name = "loginAuth"))
    public List<TraineeTaskDetailDto> getAssignedTasksForTrainee(@PathVariable Long traineeId) {
        return taskService.getAssignedTasksForTrainee(traineeId);
    }


//    @PutMapping("/{id}")
//    public TraineeTask updateTraineeTask(@PathVariable Long id, @RequestBody TraineeTask traineeTask) {
//        traineeTask.setId(id);
//        return traineeTaskService.saveTraineeTask(traineeTask);
//    }

    @DeleteMapping("/{traineeTaskId}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN','SUPERVISOR')")
    @Operation(summary = "Delete a trainee task " , security =  @SecurityRequirement(name = "loginAuth"))
    public ResponseEntity<?> deleteTraineeTask(@PathVariable Long traineeTaskId) {
        try {
            traineeTaskService.deleteTraineeTask(traineeTaskId);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }


    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN','SUPERVISOR')")
    @Operation(summary = "Update a trainee task status " , security =  @SecurityRequirement(name = "loginAuth"))
    public ResponseEntity<String> updateApprovedStatus(@PathVariable Long id, @RequestBody UpdateTraineeTaskStatus dto) {
        String updatedTraineeTaskMessage = traineeTaskService.updateApprovedStatus(id, dto.isApproved());
        return ResponseEntity.ok(updatedTraineeTaskMessage);
    }


}