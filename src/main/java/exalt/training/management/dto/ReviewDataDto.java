package exalt.training.management.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import exalt.training.management.model.forms.Question;
import exalt.training.management.model.forms.ReviewType;
import lombok.*;

import java.util.List;
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@EqualsAndHashCode(exclude = "questions")

public class ReviewDataDto {

    private Long id;

    private String title;

    private String description;

    private String targetAudience;

    @JsonIgnoreProperties("review")
    private List<Question> questions;


}
