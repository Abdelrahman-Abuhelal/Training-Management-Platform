package exalt.training.management.model.forms;

import exalt.training.management.model.SuperAdmin;
import exalt.training.management.model.Supervisor;
import exalt.training.management.model.Trainee;
import jakarta.annotation.Nullable;
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
public class ReviewSubmission {
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

    @ManyToOne
    private Review review;

    @OneToMany(cascade = CascadeType.ALL)
    private List<Answer> answers;

}
