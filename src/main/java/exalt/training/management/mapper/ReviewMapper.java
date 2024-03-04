package exalt.training.management.mapper;

import exalt.training.management.dto.FillReviewDto;
import exalt.training.management.dto.ReviewCreationDto;

import exalt.training.management.dto.ReviewDataDto;
import exalt.training.management.model.forms.Review;

import org.mapstruct.*;
import org.mapstruct.factory.Mappers;

import java.util.List;


@Mapper(componentModel = "spring")
public interface ReviewMapper {


    ReviewMapper INSTANCE = Mappers.getMapper(ReviewMapper.class);

    @Mapping(source = "reviewCreationDto.title",target = "title")
    @Mapping(source = "reviewCreationDto.description",target = "description")
    @Mapping(source = "reviewCreationDto.targetAudience",target = "targetAudience")
    @Mapping(source = "reviewCreationDto.questions",target = "questions")
    Review reviewCreationDtoToReview(ReviewCreationDto reviewCreationDto);

    @Mapping(source = "id", target = "id")
    @Mapping(source = "title",target = "title")
    @Mapping(source = "description",target = "description")
    @Mapping(source = "targetAudience",target = "targetAudience")
    @Mapping(source = "questions",target = "questions")
    List<ReviewDataDto> reviewCreationDtoListToReviewList(List<Review>  reviews);

    @Mapping(source = "questions",target = "questions")
    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    Review reviewFilledToReview(FillReviewDto fillReviewDto,@MappingTarget Review review);

}
