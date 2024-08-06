package exalt.training.management.service;

import exalt.training.management.dto.AssignTaskRequest;
import exalt.training.management.dto.TaskDto;
import exalt.training.management.exception.InvalidUserException;
import exalt.training.management.model.Task;
import exalt.training.management.model.TaskStatus;
import exalt.training.management.model.TraineeTask;
import exalt.training.management.model.users.AppUser;
import exalt.training.management.model.users.Trainee;
import exalt.training.management.repository.AppUserRepository;
import exalt.training.management.repository.TaskRepository;
import exalt.training.management.repository.TraineeTaskRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Slf4j
public class TaskService {

    private final TaskRepository taskRepository;
    private final AppUserRepository appUserRepository;
    private final TraineeTaskRepository traineeTaskRepository;

    @Autowired
    public TaskService(TaskRepository taskRepository, AppUserRepository appUserRepository, TraineeTaskRepository traineeTaskRepository) {
        this.taskRepository = taskRepository;
        this.appUserRepository = appUserRepository;
        this.traineeTaskRepository = traineeTaskRepository;
    }

    public List<TaskDto> getTasksAssignedBySupervisor() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        var user = (AppUser) authentication.getPrincipal();
        var supervisor = user.getSupervisor();

        if (supervisor == null) {
            throw new InvalidUserException("User is not a Supervisor");
        }

        List<Task> tasks = taskRepository.findAllByAssignedBy(supervisor);
        return tasks.stream().map(this::convertToDTO).collect(Collectors.toList());
    }

    public TaskDto getTaskById(Long taskId) {
        Optional<Task> taskOptional = taskRepository.findById(taskId);
        if (taskOptional.isPresent()) {
            Task task = taskOptional.get();
            return TaskDto.builder()
                    .id(task.getId())
                    .name(task.getName())
                    .description(task.getDescription())
                    .deadline(task.getDeadline())
                    .resources(task.getResources())
                    .priority(task.getPriority())
                    .assignedBy(task.getAssignedBy().getId())
                    .build();
        } else {
            throw new RuntimeException("Task not found");
        }
    }

    private TaskDto convertToDTO(Task task) {
        return TaskDto.builder()
                .id(task.getId())
                .name(task.getName())
                .description(task.getDescription())
                .deadline(task.getDeadline())
                .resources(task.getResources())
                .priority(task.getPriority())
                .assignedBy(task.getAssignedBy().getId())
                .build();
    }

    public String assignTask(AssignTaskRequest assignTaskRequest) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        var user = (AppUser) authentication.getPrincipal();
        var supervisor = user.getSupervisor();
        if(supervisor == null){
            throw new InvalidUserException("User is not a Supervisor" );
        }
        Task task = Task.builder()
                .name(assignTaskRequest.getTaskName())
                .description(assignTaskRequest.getTaskDescription())
                .deadline(assignTaskRequest.getDeadline())
                .resources(assignTaskRequest.getResources())
                .priority(assignTaskRequest.getPriorityStatus())
                .assignedBy(supervisor)
                .build();

        taskRepository.save(task);

        List<TraineeTask> traineeTasks = assignTaskRequest.getSelectedTrainees().stream().map(userId -> {
            AppUser appUser = appUserRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
            Trainee trainee=appUser.getTrainee();
            return TraineeTask.builder()
                    .task(task)
                    .trainee(trainee)
                    .dateAssigned(LocalDateTime.now())
                    .status(TaskStatus.TODO)
                    .approved(false)
                    .build();
        }).collect(Collectors.toList());

        traineeTaskRepository.saveAll(traineeTasks);
        return "task has been assigned";
    }
}
