package exalt.training.management.model.users;

import com.fasterxml.jackson.annotation.JsonBackReference;

import exalt.training.management.model.forms.Form;
import exalt.training.management.model.forms.FormSubmission;
import jakarta.persistence.*;
import lombok.*;
import org.springframework.lang.Nullable;

import java.util.List;

@Entity
@Table(name = "supervisor")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(exclude = {"user","trainees","superAdmins","reviews","reviewSubmissions"})
public class Supervisor {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JsonBackReference
    @ToString.Exclude
    private AppUser user;

    @ManyToMany(mappedBy = "supervisors", fetch = FetchType.EAGER) // Trainee already has this field
    private List<Trainee> trainees;

    @ManyToMany(cascade = CascadeType.PERSIST) // Consider adding cascade type if needed
    private List<SuperAdmin> superAdmins;
    @Nullable
    @ManyToMany
    private List<Form> forms;


}
