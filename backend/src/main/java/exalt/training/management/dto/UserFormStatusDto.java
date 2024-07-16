package exalt.training.management.dto;

import exalt.training.management.model.forms.Question;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class UserFormStatusDto {
    private Long userFormId;
    private String formTitle;
    private String formDescription;
    private List<Question> questions;
    private int numberOfQuestions;
    private String status;
    private LocalDateTime submissionDate;
}

