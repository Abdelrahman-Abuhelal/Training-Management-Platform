package exalt.training.management.dto;

import exalt.training.management.model.forms.FormType;
import exalt.training.management.model.forms.Rating;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class CompletedFormDto {

    private String type;

    private String description;

    private List<RatingDto> ratingsDto;


}
