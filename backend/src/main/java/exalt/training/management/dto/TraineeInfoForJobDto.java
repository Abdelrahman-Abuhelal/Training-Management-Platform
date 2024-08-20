package exalt.training.management.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class TraineeInfoForJobDto {
    private Long userId;
    private String universityName;
    private String universityMajor;
    private String trainingField;
    private String expectedGraduationDate;
}
