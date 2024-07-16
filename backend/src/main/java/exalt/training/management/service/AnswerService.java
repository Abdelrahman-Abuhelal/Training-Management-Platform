package exalt.training.management.service;

import exalt.training.management.dto.AnswerDto;
import exalt.training.management.model.forms.Answer;
import exalt.training.management.model.forms.Question;
import exalt.training.management.repository.AnswerRepository;
import exalt.training.management.repository.QuestionRepository;
import exalt.training.management.repository.SuperAdminRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service
@Slf4j
public class AnswerService {

    private final AnswerRepository answerRepository;
    private final QuestionRepository questionRepository;

    public AnswerService(AnswerRepository answerRepository, QuestionRepository questionRepository) {
        this.answerRepository = answerRepository;
        this.questionRepository = questionRepository;
    }


    public Answer convertToEntity(AnswerDto answerDto) {
        Question question = questionRepository.findById(answerDto.getQuestionId())
                .orElseThrow(() -> new IllegalArgumentException("Question not found"));

        return Answer.builder()
                .question(question)
                .selectedOptionsContent(answerDto.getSelectedOptionsContent())
                .build();
    }
}
