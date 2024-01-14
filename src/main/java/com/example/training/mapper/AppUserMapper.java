package com.example.training.mapper;


import com.example.training.dto.AppUserResponse;
import com.example.training.model.AppUser;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.factory.Mappers;

import java.util.List;


// try to find constant way for doing it in pom.xml
// @Mapper(componentModel = "spring")
@Mapper
public interface AppUserMapper {

    AppUserMapper INSTANCE = Mappers.getMapper(AppUserMapper.class);

    @Mapping(source = "appUser.id",target = "userId")
    @Mapping(source = "appUser.email",target = "userEmail")
    @Mapping(source = "appUser.role",target = "userRole")
    AppUserResponse userToUserDto(AppUser appUser);

    @Mapping(source = "appUser.id",target = "userId")
    @Mapping(source = "appUser.email",target = "userEmail")
    @Mapping(source = "appUser.role",target = "userRole")
    List<AppUserResponse> userToUserDto(List<AppUser> appUser);
    @Mapping(source = "appUserResponse.userId",target = "id")
    @Mapping(source = "appUserResponse.userEmail",target = "email")
    @Mapping(source = "appUserResponse.userRole",target = "role")
    AppUser userDtoToUser(AppUserResponse appUserResponse);

    @Mapping(source = "appUserResponse.userId",target = "id")
    @Mapping(source = "appUserResponse.userEmail",target = "email")
    @Mapping(source = "appUserResponse.userRole",target = "role")
    AppUser userDtoToUser(AppUserResponse appUserResponse, @MappingTarget AppUser appUser);

}