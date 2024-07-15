package exalt.training.management.model.users;

import com.fasterxml.jackson.annotation.JsonBackReference;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;
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
@EqualsAndHashCode(exclude = {"user","trainees","superAdmins"})
public class Supervisor {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @ToString.Exclude
    private AppUser user;

    @ManyToMany(mappedBy = "supervisors")
    @JsonBackReference
    private List<Trainee> trainees;

    @ManyToMany(cascade = CascadeType.PERSIST)
    private List<SuperAdmin> superAdmins;




}
