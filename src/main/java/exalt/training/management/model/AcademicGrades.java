package exalt.training.management.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "academic_grades")
@Data
@ToString
@AllArgsConstructor
@NoArgsConstructor
public class AcademicGrades {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    private AcademicGradesType type;

    private Double value;
    @ManyToOne
    @JsonBackReference
    private Trainee trainee;

    public AcademicGrades(AcademicGradesType courseType, Double value, Trainee trainee) {
        this.type = courseType;
        this.value = value;
        this.trainee = trainee;
    }

}
