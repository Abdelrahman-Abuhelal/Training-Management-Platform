package exalt.training.management.dto;

import exalt.training.management.model.TaskPriority;
import exalt.training.management.model.users.Supervisor;
import jakarta.persistence.Column;
import lombok.*;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AssignTaskRequest {

    private String taskName;
    private String taskDescription;
    private String deadline;
    private String resources;
    private TaskPriority priorityStatus;
    private List<Long> selectedTrainees;
}
