package exalt.training.management.model.forms;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import exalt.training.management.model.*;
import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Entity
@Table
@Data
@ToString
@Builder
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(exclude = {"questions","trainees","supervisors","superAdmins"})
public class Review {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;

    private String description;

    private String targetAudience;

    @OneToMany(mappedBy = "review", cascade = CascadeType.ALL)
    private List<Question> questions;


    @ManyToMany(mappedBy = "reviews")
    private List<Trainee> trainees;

    @ManyToMany(mappedBy = "reviews")
    private List<Supervisor> supervisors;

    @ManyToMany(mappedBy = "reviews")
    private List<SuperAdmin> superAdmins;
    // Getters and setters
}