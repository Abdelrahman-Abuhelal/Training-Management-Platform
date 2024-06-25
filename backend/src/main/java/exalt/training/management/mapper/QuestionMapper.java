package exalt.training.management.mapper;

import exalt.training.management.dto.FormCreationDto;
import exalt.training.management.dto.QuestionDto;
import exalt.training.management.model.forms.Form;
import exalt.training.management.model.forms.Question;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;

import java.util.List;

@Mapper(componentModel = "spring")

public interface QuestionMapper {
    QuestionMapper INSTANCE = Mappers.getMapper(QuestionMapper.class);

    @Mapping(source = "questionDto.question",target = "question")
    @Mapping(source = "questionDto.type",target = "type")
    @Mapping(source = "questionDto.options",target = "options")
    List<Question> questionDtoListToQuestionList(List<QuestionDto> questionDto);
}
