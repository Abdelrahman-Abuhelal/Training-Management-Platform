package exalt.training.management.mapper;

import exalt.training.management.dto.FormCreationDto;
import exalt.training.management.dto.FormDataDto;

import exalt.training.management.model.forms.Form;

import org.mapstruct.*;
import org.mapstruct.factory.Mappers;

import java.util.List;


@Mapper(componentModel = "spring")
public interface FormMapper {


    FormMapper INSTANCE = Mappers.getMapper(FormMapper.class);

    @Mapping(source = "formCreationDto.title",target = "title")
    @Mapping(source = "formCreationDto.description",target = "description")
    @Mapping(source = "formCreationDto.questions",target = "questions")
    Form formCreationDtoToForm(FormCreationDto formCreationDto);

    @Mapping(source = "id", target = "id")
    @Mapping(source = "title",target = "title")
    @Mapping(source = "description",target = "description")
    @Mapping(source = "questions",target = "questions")
    List<FormDataDto> formCreationDtoListToFormList(List<Form>  forms);

/*    @Mapping(source = "questions",target = "questions")
    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    Review reviewFilledToReview(FillReviewDto fillReviewDto,@MappingTarget Review review);*/

}
