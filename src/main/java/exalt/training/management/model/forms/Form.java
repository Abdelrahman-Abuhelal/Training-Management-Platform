package exalt.training.management.model.forms;

import exalt.training.management.model.users.SuperAdmin;
import exalt.training.management.model.users.Supervisor;
import exalt.training.management.model.users.Trainee;
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
public class Form {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;

    private String description;

    @OneToMany(mappedBy = "form", cascade = CascadeType.ALL)
    private List<Question> questions;

    @ManyToMany(mappedBy = "forms")
    private List<Trainee> trainees;

    @ManyToMany(mappedBy = "forms")
    private List<Supervisor> supervisors;

    @ManyToMany(mappedBy = "forms")
    private List<SuperAdmin> superAdmins;
    // Getters and setters
}