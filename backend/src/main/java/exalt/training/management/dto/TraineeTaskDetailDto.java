package exalt.training.management.dto;

import exalt.training.management.model.TaskPriority;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class TraineeTaskDetailDto {
    private Long taskId;
    private Long traineeTaskId;
    private String fullName;
    private String taskName;
    private String description;
    private String deadline;
    private String resources;
    private TaskPriority priority;
    private Long assignedBy;
    private LocalDateTime dateAssigned;
    private LocalDateTime dateFinished;
    private String status;
    private List<String> comments;
    private Boolean approved;
}
