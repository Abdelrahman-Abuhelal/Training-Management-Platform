package exalt.training.management.model.forms;

import exalt.training.management.model.users.AppUser;
import exalt.training.management.model.users.SuperAdmin;
import exalt.training.management.model.users.Supervisor;
import exalt.training.management.model.users.Trainee;
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
public class FormSubmission {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @Nullable
    private AppUser user;

    @ManyToOne
    private Form form;

    @OneToMany(cascade = CascadeType.ALL)
    private List<Answer> answers;

}
