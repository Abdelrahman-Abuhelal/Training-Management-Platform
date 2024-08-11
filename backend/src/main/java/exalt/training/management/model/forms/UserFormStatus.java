package exalt.training.management.model.forms;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import exalt.training.management.model.users.AppUser;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode
public class UserFormStatus {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "form_id", nullable = false)
    @JsonBackReference(value = "userFormStatus-form")
    private Form form;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    @JsonBackReference(value = "userFormStatus-user")
    private AppUser user;

    @OneToMany(mappedBy = "userFormStatus", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference(value = "formSubmission-userFormStatus")
    private List<FormSubmission> formSubmissions;

    @Enumerated(EnumType.STRING)
    private Status status;

    private LocalDateTime createdAt;

    public enum Status {
        FILLED,
        NOT_FILLED
    }

    @PreRemove
    private void preRemove() {
        formSubmissions.forEach(formSubmission -> formSubmission.setUserFormStatus(null));
    }
}
