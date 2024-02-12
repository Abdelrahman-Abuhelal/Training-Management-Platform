package exalt.training.management.dto;

import exalt.training.management.model.forms.ReviewType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ReviewDataDto {


    private ReviewType type;

    private String description;
    private List<RatingDto> ratingsDto;


}
