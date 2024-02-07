package exalt.training.management.dto;

import exalt.training.management.model.forms.QuestionType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class RatingDto {


    private QuestionType questionType;
    private String question;
    private String answer;


}
