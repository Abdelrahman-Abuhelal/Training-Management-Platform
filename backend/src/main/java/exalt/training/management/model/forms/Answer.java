package exalt.training.management.model.forms;

import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Entity
@Table
@Data
@ToString
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Answer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    private Question question;

    @ElementCollection
    @CollectionTable(name = "answers_options", joinColumns = @JoinColumn(name = "answer_id"))
    private List<String> selectedOptionsContent;

}
