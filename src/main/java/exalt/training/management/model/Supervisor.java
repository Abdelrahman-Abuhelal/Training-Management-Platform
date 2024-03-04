package exalt.training.management.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
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
public class Supervisor {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JsonBackReference
    private AppUser user;


    @Nullable
    @ManyToMany
    private List<Review> reviews;

    @Nullable
    @OneToMany(mappedBy = "supervisor", cascade = CascadeType.ALL)
    private List<ReviewSubmission> reviewSubmissions;
}
