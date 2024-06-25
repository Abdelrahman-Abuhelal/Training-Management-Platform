package exalt.training.management.dto;

import lombok.*;

import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@EqualsAndHashCode
public class FormDto {

    private Long id;

    private String title;

    private String description;

    private List<QuestionDto> questions;
}
