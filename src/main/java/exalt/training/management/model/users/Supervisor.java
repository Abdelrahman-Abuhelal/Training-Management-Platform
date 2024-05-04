package exalt.training.management.model.users;

import com.fasterxml.jackson.annotation.JsonBackReference;
import exalt.training.management.model.forms.Review;
import exalt.training.management.model.forms.ReviewSubmission;
import jakarta.persistence.*;
import lombok.*;
import org.springframework.lang.Nullable;

import java.util.List;

@Entity
@Table(name = "supervisor")
@Data
@Builder
@ToString
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(exclude = {"user","trainees","superAdmins","reviews","reviewSubmissions"})
public class Supervisor {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JsonBackReference
    private AppUser user;

    @ManyToMany(mappedBy = "supervisors") // Trainee already has this field
    private List<Trainee> trainees;

    @ManyToMany(cascade = CascadeType.PERSIST) // Consider adding cascade type if needed
    private List<SuperAdmin> superAdmins;
    @Nullable
    @ManyToMany
    private List<Review> reviews;

    @Nullable
    @OneToMany(mappedBy = "supervisor", cascade = CascadeType.ALL)
    private List<ReviewSubmission> reviewSubmissions;
}
