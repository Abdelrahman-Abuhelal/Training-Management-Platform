package exalt.training.management.dto;

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
public class FillReviewDto {


    private List<Question> questions;

}
