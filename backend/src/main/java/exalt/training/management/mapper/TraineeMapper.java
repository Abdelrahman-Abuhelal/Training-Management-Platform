package exalt.training.management.mapper;

import exalt.training.management.dto.TraineeDataDto;
import exalt.training.management.model.users.Trainee;
import org.mapstruct.*;
import org.mapstruct.factory.Mappers;

@Mapper(componentModel = "spring")
public interface TraineeMapper {

    TraineeMapper INSTANCE = Mappers.getMapper(TraineeMapper.class);
    @Mapping(source = "traineeDataDto.fullNameInArabic",target = "fullNameInArabic")
    @Mapping(source = "traineeDataDto.phoneNumber",target = "phoneNumber")
    @Mapping(source = "traineeDataDto.idType",target = "idType")
    @Mapping(source = "traineeDataDto.idNumber",target = "idNumber")
    @Mapping(source = "traineeDataDto.city",target = "city")
    @Mapping(source = "traineeDataDto.address",target = "address")
    @Mapping(source = "traineeDataDto.universityName",target = "universityName")
    @Mapping(source = "traineeDataDto.universityMajor",target = "universityMajor")
    @Mapping(source = "traineeDataDto.expectedGraduationDate",target = "expectedGraduationDate")
    @Mapping(source = "traineeDataDto.trainingField",target = "trainingField")
    @Mapping(source = "traineeDataDto.branchLocation",target = "branchLocation")
    @Mapping(source = "traineeDataDto.bugzillaURL",target = "bugzillaURL")
    @Mapping(source = "traineeDataDto.practiceYear",target = "practiceYear")
    @Mapping(source = "traineeDataDto.practiceSeason",target = "practiceSeason")
//    @Mapping(source = "traineeDataDto.academicGradesDto", target = "academicGrades", ignore = true)
    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    Trainee traineeDataDtoToTrainee(TraineeDataDto traineeDataDto);

    @Mapping(source = "traineeDataDto.fullNameInArabic",target = "fullNameInArabic")
    @Mapping(source = "traineeDataDto.phoneNumber",target = "phoneNumber")
    @Mapping(source = "traineeDataDto.idType",target = "idType")
    @Mapping(source = "traineeDataDto.idNumber",target = "idNumber")
    @Mapping(source = "traineeDataDto.city",target = "city")
    @Mapping(source = "traineeDataDto.address",target = "address")
    @Mapping(source = "traineeDataDto.universityName",target = "universityName")
    @Mapping(source = "traineeDataDto.universityMajor",target = "universityMajor")
    @Mapping(source = "traineeDataDto.expectedGraduationDate",target = "expectedGraduationDate")
    @Mapping(source = "traineeDataDto.trainingField",target = "trainingField")
    @Mapping(source = "traineeDataDto.branchLocation",target = "branchLocation")
    @Mapping(source = "traineeDataDto.bugzillaURL",target = "bugzillaURL")
    @Mapping(source = "traineeDataDto.practiceYear",target = "practiceYear")
    @Mapping(source = "traineeDataDto.practiceSeason",target = "practiceSeason")
//    @Mapping(source = "traineeDataDto.academicGradesDto", target = "academicGrades", ignore = true)
    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    Trainee traineeDataDtoToTrainee(TraineeDataDto traineeDataDto, @MappingTarget Trainee trainee);

}
