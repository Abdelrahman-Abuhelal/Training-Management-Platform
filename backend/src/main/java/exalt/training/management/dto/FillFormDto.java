package exalt.training.management.dto;

import exalt.training.management.model.forms.Answer;
import exalt.training.management.model.forms.Question;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class FillFormDto {


    private List<AnswerDto> answers;

}
