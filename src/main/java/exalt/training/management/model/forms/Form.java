package exalt.training.management.model.forms;

import exalt.training.management.model.SuperAdmin;
import exalt.training.management.model.Supervisor;
import exalt.training.management.model.Trainee;
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
@EqualsAndHashCode
public class Form {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @Nullable
    private Trainee trainee;

    @ManyToOne
    @Nullable
    private Supervisor supervisor;

    @ManyToOne
    @Nullable
    private SuperAdmin superAdmin;
    @Enumerated(EnumType.STRING)
    private FormType type;

    private String description;

    @Nullable
    @OneToMany(mappedBy = "form", cascade = CascadeType.ALL)
    private List <Rating> ratings;

    // Getters and setters
}