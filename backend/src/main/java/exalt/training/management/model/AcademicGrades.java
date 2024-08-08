package exalt.training.management.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import exalt.training.management.model.users.Trainee;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "academic_grades")
@Data
@ToString
@AllArgsConstructor
@NoArgsConstructor
@EqualsAndHashCode(exclude = "trainee")
public class AcademicGrades {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;


    @ManyToOne
    @JoinColumn(name = "course_id")
    private Course course; // Reference to Course entity

    private Double mark;

    @ManyToOne
    @JsonBackReference
    private Trainee trainee;

    public AcademicGrades(Course course, Double mark, Trainee trainee) {
        this.course = course;
        this.mark = mark;
        this.trainee = trainee;
    }
}
