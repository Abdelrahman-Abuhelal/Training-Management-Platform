package com.example.training.mapper;


import com.example.training.model.AppUser;
import com.example.training.model.AppUserResponseDto;
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
    @Mapping(source = "appUser.username",target = "userUsername")
    @Mapping(source = "appUser.role",target = "userRole")
    AppUserResponseDto userToUserDto(AppUser appUser);

    @Mapping(source = "appUser.id",target = "userId")
    @Mapping(source = "appUser.username",target = "userUsername")
    @Mapping(source = "appUser.role",target = "userRole")
    List<AppUserResponseDto> userToUserDto(List<AppUser> appUser);
    @Mapping(source = "appUserResponseDto.userId",target = "id")
    @Mapping(source = "appUserResponseDto.userUsername",target = "username")
    @Mapping(source = "appUserResponseDto.userRole",target = "role")
    AppUser userDtoToUser(AppUserResponseDto appUserResponseDto);

    @Mapping(source = "appUserResponseDto.userId",target = "id")
    @Mapping(source = "appUserResponseDto.userUsername",target = "username")
    @Mapping(source = "appUserResponseDto.userRole",target = "role")
    AppUser userDtoToUser(AppUserResponseDto appUserResponseDto, @MappingTarget AppUser appUser);

}
