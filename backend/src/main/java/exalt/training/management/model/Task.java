package exalt.training.management.model;

import exalt.training.management.model.users.Supervisor;
import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "tasks")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Task {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String description;
    private String deadline;
    @Column(length = 2000)
    private String resources;
    @Enumerated(EnumType.STRING)
    private TaskPriority priority;


    @ManyToOne
    @JoinColumn(name = "assigned_by")
    private Supervisor assignedBy;

    @OneToMany(mappedBy = "task", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<TraineeTask> assignedTrainees = new ArrayList<>();


}
