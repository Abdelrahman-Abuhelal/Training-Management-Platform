package exalt.training.management.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table
@Data
@ToString
@NoArgsConstructor
@AllArgsConstructor
public class AcademicGrades {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private Double tawjeehi;
    private Double universityGrade;
    private Double programmingOne;
    private Double objectOriented;
    private Double dataStructure;
    private Double databaseOne;
    private Double databaseTwo;
    @OneToOne
    @JsonBackReference
    private Trainee trainee;
}
