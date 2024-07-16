package exalt.training.management.model.forms;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import exalt.training.management.model.users.AppUser;
import exalt.training.management.model.users.SuperAdmin;
import exalt.training.management.model.users.Supervisor;
import exalt.training.management.model.users.Trainee;
import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Entity
@Table
@Data
@ToString(exclude = {"questions", "userFormStatuses"})
@Builder
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(exclude = {"questions","userFormStatuses"})
public class Form {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;

    private String description;

    @OneToMany(mappedBy = "form", cascade = CascadeType.ALL)
    @JsonManagedReference(value = "question-form")
    private List<Question> questions;

    @OneToMany(mappedBy = "form", cascade = CascadeType.ALL)
    @JsonIgnore
    private List<UserFormStatus> userFormStatuses;

    // Getters and setters
}