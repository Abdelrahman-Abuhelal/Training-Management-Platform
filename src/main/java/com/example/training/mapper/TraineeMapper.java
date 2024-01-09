package com.example.training.mapper;

import com.example.training.dto.TraineeRegistrationDto;
import com.example.training.model.AppUser;
import com.example.training.model.AppUserRole;
import org.mapstruct.AfterMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.factory.Mappers;


@Mapper
public interface TraineeMapper {
    TraineeMapper INSTANCE = Mappers.getMapper(TraineeMapper.class);

    @Mapping(source = "username",target = "username")
    @Mapping(source = "email",target = "email")
    @Mapping(source = "password",target = "password")
    AppUser registeredTraineeToUser(TraineeRegistrationDto traineeRegistrationDto);


    @AfterMapping
    default void setRole(@MappingTarget AppUser appUser) {
        appUser.setRole(AppUserRole.TRAINEE);
    }
}
