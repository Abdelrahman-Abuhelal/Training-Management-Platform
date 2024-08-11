package exalt.training.management.dto;

import jakarta.validation.constraints.NotNull;
import lombok.*;


@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TrainingPlanCreateRequestDTO {

    @NotNull
    private byte[] planFile; // The uploaded file

    @NotNull
    private String fileName; // The original file name

}
