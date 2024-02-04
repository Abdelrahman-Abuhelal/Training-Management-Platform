package exalt.training.management.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "academic_grades")
@Data
@ToString
@NoArgsConstructor
@AllArgsConstructor
public class AcademicGrades {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private Double tawjeehi;
    private Double universityGpa;
    private Double programmingOne;
    private Double objectOriented;
    private Double dataStructure;
    private Double databaseOne;
    private Double databaseTwo;
    @OneToOne
    @JsonBackReference
    private Trainee trainee;
}
