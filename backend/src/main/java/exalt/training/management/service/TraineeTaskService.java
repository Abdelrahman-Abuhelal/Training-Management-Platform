package exalt.training.management.service;

import exalt.training.management.dto.AssignTaskRequest;
import exalt.training.management.dto.TraineeTaskDTO;
import exalt.training.management.exception.InvalidStatusException;
import exalt.training.management.exception.InvalidUserException;
import exalt.training.management.exception.TaskNotFoundException;
import exalt.training.management.model.Comment;
import exalt.training.management.model.Task;
import exalt.training.management.model.TaskStatus;
import exalt.training.management.model.TraineeTask;
import exalt.training.management.model.users.AppUser;
import exalt.training.management.model.users.Trainee;
import exalt.training.management.repository.AppUserRepository;
import exalt.training.management.repository.TaskRepository;
import exalt.training.management.repository.TraineeRepository;
import exalt.training.management.repository.TraineeTaskRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Slf4j
public class TraineeTaskService {

    @Autowired
    private TraineeTaskRepository traineeTaskRepository;

    @Autowired
    private TaskRepository taskRepository;

    @Autowired
    private AppUserRepository appUserRepository;

    public List<TraineeTask> getAllTraineeTasks() {
        return traineeTaskRepository.findAll();
    }

    public TraineeTask getTraineeTaskById(Long id) {
        return traineeTaskRepository.findById(id).orElseThrow(() -> new RuntimeException("TraineeTask not found"));
    }

    public TraineeTask saveTraineeTask(TraineeTask traineeTask) {
        return traineeTaskRepository.save(traineeTask);
    }

    public void deleteTraineeTask(Long traineeTaskId) {
        traineeTaskRepository.deleteById(traineeTaskId);
    }

    public void updateTaskStatus(Long traineeTaskId, String status)  {
        Optional<TraineeTask> optionalTask = traineeTaskRepository.findById(traineeTaskId);

        if (optionalTask.isEmpty()) {
            throw new TaskNotFoundException("Task with ID " + traineeTaskId + " not found.");
        }

        TraineeTask task = optionalTask.get();

        // Validate status
        if (!isValidStatus(status)) {
            throw new InvalidStatusException("Invalid status: " + status);
        }

        task.setStatus(TaskStatus.valueOf(status));
        traineeTaskRepository.save(task);
    }

    private boolean isValidStatus(String status) {
        return Arrays.asList("TODO", "IN_PROGRESS", "STUCK", "IN_REVIEW", "COMPLETED").contains(status);
    }
    public List<TraineeTaskDTO> getAllTraineeTasksByTaskId(Long taskId) {
        return traineeTaskRepository.findByTaskId(taskId).stream()
                .map(traineeTask -> {
                    List<String> comments = traineeTask.getComments().stream()
                            .map(Comment::getCommentText)
                            .collect(Collectors.toList());
                    AppUser appUser=traineeTask.getTrainee().getUser();
                    return TraineeTaskDTO.builder()
                            .traineeTaskId(traineeTask.getId())
                            .taskId(traineeTask.getTask().getId())
                            .traineeId(traineeTask.getTrainee().getId())
                            .userId(appUser.getId())
                            .fullName(appUser.getFirstName()+" "+appUser.getLastName())
                            .dateAssigned(traineeTask.getDateAssigned())
                            .status(traineeTask.getStatus().name())
                            .comments(comments)
                            .approved(traineeTask.getApproved())
                            .build();
                })
                .collect(Collectors.toList());
    }




    public String updateApprovedStatus(Long traineeTaskId, boolean approved) {
        Optional<TraineeTask> optionalTraineeTask = traineeTaskRepository.findById(traineeTaskId);
        if (optionalTraineeTask.isPresent()) {
            TraineeTask traineeTask = optionalTraineeTask.get();
            traineeTask.setApproved(approved);
            if (approved){
                traineeTask.setDateFinished(LocalDateTime.now());
            }
            traineeTaskRepository.save(traineeTask);
            return "Trainee task status has been updated";
        } else {
            throw new EntityNotFoundException("TraineeTask not found with id: " + traineeTaskId);
        }
    }
}
