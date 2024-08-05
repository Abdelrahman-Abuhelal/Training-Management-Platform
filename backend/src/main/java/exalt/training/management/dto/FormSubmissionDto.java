package exalt.training.management.dto;

import exalt.training.management.model.forms.Answer;
import exalt.training.management.model.users.AppUser;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@EqualsAndHashCode
public class FormSubmissionDto {

    private Long id;
    private Long userId;
    private String firstName;
    private String lastName;
    private String branch;
    private String email;
    private LocalDateTime submittedAt;


}
