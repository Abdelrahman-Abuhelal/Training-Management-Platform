package exalt.training.management.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import exalt.training.management.model.forms.Question;
import lombok.*;

import java.util.List;
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@EqualsAndHashCode(exclude = "questions")

public class FormDataDto {

    private Long id;

    private String title;

    private String description;

    @JsonIgnoreProperties("review")
    private List<Question> questions;


}
