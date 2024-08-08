package exalt.training.management.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import exalt.training.management.model.users.Trainee;
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
    private byte[] trainingFile; // For storing the file (could be a PDF, DOC, etc.)

    private String fileName; // To store the original file name


    @ManyToOne
    @JoinColumn(name = "trainee_id", nullable = false)
    @JsonBackReference
    private Trainee trainee; // Reference to the trainee

    // Additional fields related to the training plan can be added here
}
