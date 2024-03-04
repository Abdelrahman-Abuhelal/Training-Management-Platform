package exalt.training.management.dto;

import exalt.training.management.model.AppUserRole;
import exalt.training.management.model.forms.Question;
import jakarta.persistence.CascadeType;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.OneToMany;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ReviewCreationDto {

    private String title;

    private String description;

    private String targetAudience;

    @OneToMany(mappedBy = "review", cascade = CascadeType.ALL)
    private List<Question> questions;

}
