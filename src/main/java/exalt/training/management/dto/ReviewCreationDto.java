package exalt.training.management.dto;

import exalt.training.management.model.forms.Question;
import jakarta.persistence.CascadeType;
import jakarta.persistence.OneToMany;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ReviewCreationDto {

    private String title;

    private String description;

    @OneToMany(mappedBy = "review", cascade = CascadeType.ALL)
    private List<Question> questions;

}
