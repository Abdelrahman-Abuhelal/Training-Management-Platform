package exalt.training.management.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class AcademicGradesDto {
    private Double tawjeehi;
    private Double universityGrade;
    private Double programmingOne;
    private Double dataStructure;
    private Double objectOriented;
    private Double databaseOne;
    private Double databaseTwo;
}
