package exalt.training.management.model;

import exalt.training.management.model.users.Trainee;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "training_plan_assignment")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TrainingPlanAssignment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "training_plan_id", nullable = false)
    private TrainingPlan trainingPlan;

    @ManyToOne
    @JoinColumn(name = "trainee_id", nullable = false)
    private Trainee trainee;
}
