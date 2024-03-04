//package exalt.training.management.mapper;
//
//import exalt.training.management.dto.RatingDto;
//import exalt.training.management.dto.TraineeDataDto;
//import exalt.training.management.model.Trainee;
//import org.mapstruct.Mapper;
//import org.mapstruct.Mapping;
//import org.mapstruct.factory.Mappers;
//
//import java.util.List;
//
//@Mapper(componentModel = "spring")
//
//public interface RatingMapper {
//    RatingMapper INSTANCE = Mappers.getMapper(RatingMapper.class);
//
//    @Mapping(source = "ratingDto.questionType",target = "questionType")
//    @Mapping(source = "ratingDto.question",target = "question")
//    @Mapping(source = "ratingDto.answer",target = "answer")
//    List<Rating> ratingDtoListToRatingList(List<RatingDto> ratingDto);
//
//    @Mapping(source = "ratingDto.questionType",target = "questionType")
//    @Mapping(source = "ratingDto.question",target = "question")
//    @Mapping(source = "ratingDto.answer",target = "answer")
//    Rating ratingDtoToRating(RatingDto ratingDto);
//    @Mapping(source = "rating.questionType",target = "questionType")
//    @Mapping(source = "rating.question",target = "question")
//    @Mapping(source = "rating.answer",target = "answer")
//    List<RatingDto> ratingToRatingDto(List<Rating> ratings);
//
//}
