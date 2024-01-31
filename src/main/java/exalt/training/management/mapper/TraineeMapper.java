package exalt.training.management.mapper;

import exalt.training.management.dto.AppUserRequestDto;
import exalt.training.management.dto.TraineeDataDto;
import exalt.training.management.model.AppUser;
import exalt.training.management.model.Trainee;
import org.mapstruct.*;
import org.mapstruct.factory.Mappers;

@Mapper
public interface TraineeMapper {

    TraineeMapper INSTANCE = Mappers.getMapper(TraineeMapper.class);

    @Mapping(source = "traineeDataDto.phoneNumber",target = "phoneNumber")
    @Mapping(source = "traineeDataDto.idNumber",target = "idNumber")
    @Mapping(source = "traineeDataDto.address",target = "address")
    @Mapping(source = "traineeDataDto.universityName",target = "universityName")
    @Mapping(source = "traineeDataDto.expectedGraduationDate",target = "expectedGraduationDate")
    @Mapping(source = "traineeDataDto.trainingField",target = "trainingField")
    @Mapping(source = "traineeDataDto.branchLocation",target = "branchLocation")
    Trainee traineeDataDtoToTrainee(TraineeDataDto traineeDataDto);

    @Mapping(source = "traineeDataDto.phoneNumber",target = "phoneNumber")
    @Mapping(source = "traineeDataDto.idNumber",target = "idNumber")
    @Mapping(source = "traineeDataDto.address",target = "address")
    @Mapping(source = "traineeDataDto.universityName",target = "universityName")
    @Mapping(source = "traineeDataDto.expectedGraduationDate",target = "expectedGraduationDate")
    @Mapping(source = "traineeDataDto.trainingField",target = "trainingField")
    @Mapping(source = "traineeDataDto.branchLocation",target = "branchLocation")
    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    Trainee traineeDataDtoToTrainee(TraineeDataDto traineeDataDto, @MappingTarget Trainee trainee);

}
