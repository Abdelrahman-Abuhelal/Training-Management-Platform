package exalt.training.management.mapper;

import exalt.training.management.dto.RegistrationRequest;
import exalt.training.management.model.AppUser;
import exalt.training.management.model.AppUserRole;
import org.mapstruct.AfterMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.factory.Mappers;


@Mapper
public interface TraineeMapper {
    TraineeMapper INSTANCE = Mappers.getMapper(TraineeMapper.class);


    //this is now wrong
    @Mapping(source = "email",target = "email")
    @Mapping(source = "password",target = "password")
    @Mapping(source = "firstName",target = "firstName")
    @Mapping(source = "lastName",target = "lastName")
    @Mapping(source = "role",target = "role")
    AppUser registeredTraineeToUser(RegistrationRequest registrationRequest);


    @AfterMapping
    default void setRole(@MappingTarget AppUser appUser) {
        appUser.setRole(AppUserRole.TRAINEE);
    }
}