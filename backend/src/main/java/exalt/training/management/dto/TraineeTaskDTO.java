package exalt.training.management.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TraineeTaskDTO {

    private Long traineeTaskId;
    private Long taskId;
    private Long traineeId;
    private Long userId;
    private String fullName;
    private LocalDateTime dateAssigned;
    private String status;
    private List<String> comments;
    private Boolean approved;

}



