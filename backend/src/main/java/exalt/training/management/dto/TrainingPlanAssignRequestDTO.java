package exalt.training.management.dto;

import lombok.*;

import java.util.Set;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TrainingPlanAssignRequestDTO {


    @NonNull
    private Set<Long> userIds; // IDs of trainees to associate with the training plan
}
