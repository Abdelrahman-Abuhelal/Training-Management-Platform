package exalt.training.management.model.forms;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import exalt.training.management.model.users.AppUser;
import jakarta.annotation.Nullable;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table
@Data
@ToString
@Builder
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(exclude = {"user","userFormStatus","form","answers"})
public class FormSubmission {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JsonBackReference(value = "formSubmission-user")
    private AppUser user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_form_status_id", nullable = false)
    @JsonBackReference(value = "formSubmission-userFormStatus")
    private UserFormStatus userFormStatus;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "form_id")
    @JsonBackReference(value = "formSubmission-form")
    private Form form;

    @OneToMany(cascade = CascadeType.ALL,fetch = FetchType.LAZY)
    private List<Answer> answers;

    private LocalDateTime submittedAt;

}
