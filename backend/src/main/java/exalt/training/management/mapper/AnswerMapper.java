package exalt.training.management.mapper;

import exalt.training.management.dto.AnswerDto;
import exalt.training.management.dto.QuestionDto;
import exalt.training.management.model.forms.Answer;
import exalt.training.management.model.forms.Question;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;

import java.util.List;

@Mapper(componentModel = "spring")

public interface AnswerMapper {
    AnswerMapper INSTANCE = Mappers.getMapper(AnswerMapper.class);

    @Mapping(source = "answerDto.question",target = "question")
    @Mapping(source = "answerDto.selectedOptionsContent",target = "selectedOptionsContent")
    List<Answer> answerDtoListToAnswerList(  List<AnswerDto> answerDto);}
