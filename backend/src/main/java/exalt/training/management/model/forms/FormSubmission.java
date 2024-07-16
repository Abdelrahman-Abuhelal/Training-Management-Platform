package exalt.training.management.model.forms;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import exalt.training.management.model.users.AppUser;
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
@EqualsAndHashCode(exclude = {"user","form","answers"})
public class FormSubmission {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Nullable
    @ManyToOne
    @JsonBackReference(value = "formSubmission-user")
    private AppUser user;

    @ManyToOne
    private UserFormStatus userFormStatus;

    @OneToMany(cascade = CascadeType.ALL)
    private List<Answer> answers;

}
