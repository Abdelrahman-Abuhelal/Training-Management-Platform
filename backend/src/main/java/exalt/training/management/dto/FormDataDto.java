package exalt.training.management.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import exalt.training.management.model.forms.Question;
import lombok.*;

import java.util.List;
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@EqualsAndHashCode

public class FormDataDto {

    private String title;

    private String description;

    private List<QuestionDto> questions;


}
