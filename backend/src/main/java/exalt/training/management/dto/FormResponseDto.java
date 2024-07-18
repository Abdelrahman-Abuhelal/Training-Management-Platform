package exalt.training.management.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class FormResponseDto {
    private String formTitle;
    private String formDescription;
    private List<QuestionFullDto> questions;
    private List<AnswerDto> answers;
}
