package exalt.training.management.model.forms;

import com.fasterxml.jackson.annotation.JsonBackReference;
import exalt.training.management.model.users.AppUser;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

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

    @ManyToOne
    @JoinColumn(name = "form_id", nullable = false)
    private Form form;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    @JsonBackReference(value = "userFormStatus-user")
    private AppUser user;

    @Enumerated(EnumType.STRING)
    private Status status;

    private LocalDateTime submissionDate;

    public enum Status {
        FILLED,
        NOT_FILLED
    }
}
