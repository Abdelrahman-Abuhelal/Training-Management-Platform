package exalt.training.management.model.forms;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;
import exalt.training.management.model.*;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import lombok.*;
import org.springframework.lang.Nullable;

import java.util.List;

@Entity
@Table
@Data
@ToString
@Builder
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(exclude = {"questions","trainees", "supervisors", "superAdmins",})
public class Review {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;

    private String description;

    private String targetAudience;

    @OneToMany(mappedBy = "review", cascade = CascadeType.ALL)
    private List<Question> questions;

    @Nullable
    @ManyToMany(mappedBy = "reviews") // Mapped by the "reviews" property in Trainee
    private List <Trainee> trainees;

    @Nullable
    @ManyToMany(mappedBy = "reviews") // Mapped by the "reviews" property in Trainee
    private List<Supervisor> supervisors;

    @Nullable
    @ManyToMany(mappedBy = "reviews") // Mapped by the "reviews" property in Trainee
    private List<SuperAdmin> superAdmins;

    // Getters and setters
}