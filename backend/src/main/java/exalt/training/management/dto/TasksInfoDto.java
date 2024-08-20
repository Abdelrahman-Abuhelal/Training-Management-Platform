package exalt.training.management.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class TasksInfoDto {
    private Long userId;
    private Long taskId;
    private String name;
    private String description;
}
