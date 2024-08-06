package exalt.training.management.dto;

import exalt.training.management.model.TaskPriority;
import exalt.training.management.model.TaskStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class TaskDto {
     private Long id;
     private String name;
     private String description;
     private String deadline;
     private String resources;
     private TaskPriority priority;
     private Long assignedBy;

}
