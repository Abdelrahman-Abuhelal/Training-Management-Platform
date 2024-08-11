package exalt.training.management.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import exalt.training.management.model.users.Supervisor;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "training_plan")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TrainingPlan {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Lob
    @Column(name = "plan_file", columnDefinition = "LONGBLOB")
    private byte[] planFile;

    private String fileName;

    @ManyToOne
    @JoinColumn(name = "supervisor_id", nullable = false)
    @JsonBackReference
    private Supervisor supervisor;
}
