package exalt.training.management.model.users;

import com.fasterxml.jackson.annotation.JsonBackReference;
import exalt.training.management.model.forms.Form;
import exalt.training.management.model.forms.FormSubmission;
import exalt.training.management.model.users.AppUser;
import jakarta.persistence.*;
import lombok.*;
import org.springframework.lang.Nullable;

import java.util.List;

@Entity
@Table(name = "super_admin")
@Data
@Builder
@ToString
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(exclude = {"supervisors","user","reviews","reviewSubmissions"})
public class SuperAdmin {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JsonBackReference
    @ToString.Exclude
    private AppUser user;



}
