package exalt.training.management.model;


import com.fasterxml.jackson.annotation.JsonBackReference;
import exalt.training.management.model.users.Trainee;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "trainee_skills")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TraineeSkill {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "trainee_id", nullable = false)
    @JsonBackReference
    private Trainee trainee;

    @ManyToOne
    @JoinColumn(name = "skill_id", nullable = false)
    private Skill skill;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ProficiencyLevel proficiencyLevel;

    public enum ProficiencyLevel {
        GOOD,
        VERY_GOOD,
        EXCELLENT,
        EXPERT
    }


}
