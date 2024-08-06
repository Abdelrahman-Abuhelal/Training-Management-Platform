package exalt.training.management.controller;

import exalt.training.management.dto.AssignTaskRequest;
import exalt.training.management.dto.UpdateTraineeTaskStatus;
import exalt.training.management.model.TraineeTask;
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

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/traineeTasks")
@Slf4j
public class TraineeTaskController {

    @Autowired
    private TraineeTaskService traineeTaskService;

    @GetMapping
    public List<TraineeTask> getAllTraineeTasks() {
        return traineeTaskService.getAllTraineeTasks();
    }

    @GetMapping("/{id}")
    public TraineeTask getTraineeTaskById(@PathVariable Long id) {
        return traineeTaskService.getTraineeTaskById(id);
    }

    @PostMapping
    public TraineeTask createTraineeTask(@RequestBody TraineeTask traineeTask) {
        return traineeTaskService.saveTraineeTask(traineeTask);
    }

//    @PutMapping("/{id}")
//    public TraineeTask updateTraineeTask(@PathVariable Long id, @RequestBody TraineeTask traineeTask) {
//        traineeTask.setId(id);
//        return traineeTaskService.saveTraineeTask(traineeTask);
//    }

    @DeleteMapping("/{id}")
    public void deleteTraineeTask(@PathVariable Long id) {
        traineeTaskService.deleteTraineeTask(id);
    }


    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN','SUPERVISOR')")
    @Operation(summary = "Update a trainee task status " , security =  @SecurityRequirement(name = "loginAuth"))
    public ResponseEntity<String> updateApprovedStatus(@PathVariable Long id, @RequestBody UpdateTraineeTaskStatus dto) {
        String updatedTraineeTaskMessage = traineeTaskService.updateApprovedStatus(id, dto.isApproved());
        return ResponseEntity.ok(updatedTraineeTaskMessage);
    }


}