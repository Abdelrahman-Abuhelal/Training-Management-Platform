package exalt.training.management.mapper;

import exalt.training.management.dto.AcademicGradesDto;
import exalt.training.management.model.AcademicGrades;
import org.mapstruct.*;

@Mapper
public interface AcademicGradesMapper {

    @Mapping(source = "academicGradesDto.tawjeehi",target = "tawjeehi")
    @Mapping(source = "academicGradesDto.universityGrade",target = "universityGrade")
    @Mapping(source = "academicGradesDto.programmingOne",target = "programmingOne")
    @Mapping(source = "academicGradesDto.objectOriented",target = "objectOriented")
    @Mapping(source = "academicGradesDto.dataStructure",target = "dataStructure")
    @Mapping(source = "academicGradesDto.databaseOne",target = "databaseOne")
    @Mapping(source = "academicGradesDto.databaseTwo",target = "databaseTwo")
    AcademicGrades academicGradesDtoToAcademicGrades(AcademicGradesDto academicGradesDto);

    @Mapping(source = "academicGradesDto.tawjeehi",target = "tawjeehi")
    @Mapping(source = "academicGradesDto.universityGrade",target = "universityGrade")
    @Mapping(source = "academicGradesDto.programmingOne",target = "programmingOne")
    @Mapping(source = "academicGradesDto.objectOriented",target = "objectOriented")
    @Mapping(source = "academicGradesDto.dataStructure",target = "dataStructure")
    @Mapping(source = "academicGradesDto.databaseOne",target = "databaseOne")
    @Mapping(source = "academicGradesDto.databaseTwo",target = "databaseTwo")
    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    AcademicGrades academicGradesDtoToAcademicGrades(AcademicGradesDto academicGradesDto, @MappingTarget AcademicGrades academicGrades);
}
