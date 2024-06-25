package exalt.training.management.mapper;

import exalt.training.management.dto.FormCreationDto;
import exalt.training.management.dto.FormDataDto;

import exalt.training.management.dto.FormDto;
import exalt.training.management.dto.TraineeDataDto;
import exalt.training.management.model.forms.Form;

import exalt.training.management.model.users.Trainee;
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

    @Mapping(source = "title",target = "title")
    @Mapping(source = "description",target = "description")
    @Mapping(source = "questions",target = "questions")
    FormCreationDto formToFormCreationDto(Form forms);

    @Mapping(source = "id", target = "id")
    @Mapping(source = "title",target = "title")
    @Mapping(source = "description",target = "description")
    @Mapping(source = "questions",target = "questions")
    List<FormDto> formListToFormDtoList(List<Form>  forms);

    @Mapping(source = "title",target = "title")
    @Mapping(source = "description",target = "description")
    @Mapping(source = "questions",target = "questions")
    FormDataDto formToFormDto(Form  form);


    @Mapping(source = "title",target = "title")
    @Mapping(source = "description",target = "description")
    @Mapping(source = "questions",target = "questions")
    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    Form formCreationDtoToForm(FormCreationDto formCreationDto, @MappingTarget Form form);

    @Mapping(source = "title",target = "title")
    @Mapping(source = "description",target = "description")
    @Mapping(source = "questions",target = "questions")
    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    Form formDataDtoToForm(FormDataDto formDataDto, @MappingTarget Form form);

    @Mapping(source = "title",target = "title")
    @Mapping(source = "description",target = "description")
    @Mapping(source = "questions",target = "questions")
    Form formDataDtoToForm(FormDataDto formDataDto);


/*    @Mapping(source = "questions",target = "questions")
    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    Review reviewFilledToReview(FillReviewDto fillReviewDto,@MappingTarget Review review);*/

}
