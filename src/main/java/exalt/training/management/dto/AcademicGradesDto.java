package exalt.training.management.dto;

import lombok.*;

@Data
@Builder
@ToString
@AllArgsConstructor
@NoArgsConstructor
public class AcademicGradesDto {
    private Double tawjeehi;
    private Double universityGpa;
    private Double programmingOne;
    private Double dataStructure;
    private Double objectOriented;
    private Double databaseOne;
    private Double databaseTwo;
}
