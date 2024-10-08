package exalt.training.management.controller;

import exalt.training.management.dto.TaskDto;
import exalt.training.management.dto.TasksInfoDto;
import exalt.training.management.dto.TraineeTaskDTO;
import exalt.training.management.model.Task;
import exalt.training.management.model.TraineeTask;
import exalt.training.management.service.TaskService;
import exalt.training.management.service.TraineeTaskService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/tasks")
public class TaskController {

    private final TaskService taskService;
    private final TraineeTaskService traineeTaskService;


    @GetMapping("/all")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN','SUPERVISOR')")
    @Operation(summary = "Get All Tasks" , security =  @SecurityRequirement(name = "loginAuth"))
    public List<TasksInfoDto> getAllTasks() {
        return taskService.getAllTasksAssigned();
    }


    @GetMapping("/{taskId}/trainee-tasks")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN','SUPERVISOR')")
    @Operation(summary = "Get All Trainee Tasks by a task id " , security =  @SecurityRequirement(name = "loginAuth"))
    public ResponseEntity<List<TraineeTaskDTO>> getTraineeTasksByTaskId(@PathVariable Long taskId) {
        List<TraineeTaskDTO> traineeTasks = traineeTaskService.getAllTraineeTasksByTaskId(taskId);
        return ResponseEntity.ok(traineeTasks);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN','SUPERVISOR','TRAINEE')")
    @Operation(summary = "Get Task Details by a task id " , security =  @SecurityRequirement(name = "loginAuth"))
    public TaskDto getTaskById(@PathVariable Long id) {
        return taskService.getTaskById(id);
    }


    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN','SUPERVISOR')")
    @Operation(summary = "Delete Task using task id " , security =  @SecurityRequirement(name = "loginAuth"))
    public void deleteTask(@PathVariable Long id) {
     taskService.deleteTask(id);
    }

}
