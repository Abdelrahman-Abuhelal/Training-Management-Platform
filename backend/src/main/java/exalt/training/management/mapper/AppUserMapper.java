package exalt.training.management.mapper;


import exalt.training.management.dto.AppUserDto;
import exalt.training.management.dto.AppUserRequestDto;
import exalt.training.management.model.users.AppUser;
import org.mapstruct.*;
import org.mapstruct.factory.Mappers;

import java.util.List;


// try to find constant way for doing it in pom.xml
@Mapper(componentModel = "spring")
public interface AppUserMapper {

    AppUserMapper INSTANCE = Mappers.getMapper(AppUserMapper.class);

    @Mapping(source = "appUser.id",target = "userId")
    @Mapping(source = "appUser.email",target = "userEmail")
    @Mapping(source = "appUser.role",target = "userRole")
    @Mapping(source = "appUser.firstName",target = "userFirstName")
    @Mapping(source = "appUser.lastName",target = "userLastName")
    @Mapping(source = "appUser.username",target = "userUsername")
    @Mapping(source = "appUser.userBranch",target = "userBranch")
    @Mapping(source = "appUser.enabled",target = "userEnabled")
    @Mapping(source = "appUser.verified",target = "userVerified")
    AppUserDto userToUserDto(AppUser appUser);

    @Mapping(source = "appUser.id",target = "userId")
    @Mapping(source = "appUser.email",target = "userEmail")
    @Mapping(source = "appUser.role",target = "userRole")
    @Mapping(source = "appUser.firstName",target = "userFirstName")
    @Mapping(source = "appUser.lastName",target = "userLastName")
    @Mapping(source = "appUser.username",target = "userUsername")
    @Mapping(source = "appUser.userBranch",target = "userBranch")
    @Mapping(source = "appUser.enabled",target = "userEnabled")
    @Mapping(source = "appUser.verified",target = "userVerified")
    List<AppUserDto> userToUserDto(List<AppUser> appUser);

    @Mapping(source = "appUserDto.userId",target = "id")
    @Mapping(source = "appUserDto.userEmail",target = "email")
    @Mapping(source = "appUserDto.userRole",target = "role")
    @Mapping(source = "appUserDto.userFirstName",target = "firstName")
    @Mapping(source = "appUserDto.userLastName",target = "lastName")
    @Mapping(source = "appUserDto.userUsername",target = "username")
    @Mapping(source = "appUserDto.userBranch",target = "userBranch")
    @Mapping(source = "appUserDto.userEnabled",target = "enabled")
    @Mapping(source = "appUserDto.userVerified",target = "verified")
    AppUser userDtoToUser(AppUserDto appUserDto);

    @Mapping(source = "appUserDto.userId",target = "id")
    @Mapping(source = "appUserDto.userEmail",target = "email")
    @Mapping(source = "appUserDto.userFirstName",target = "firstName")
    @Mapping(source = "appUserDto.userLastName",target = "lastName")
    @Mapping(source = "appUserDto.userRole",target = "role")
    @Mapping(source = "appUserDto.userUsername",target = "username")
    @Mapping(source = "appUserDto.userBranch",target = "userBranch")
    @Mapping(source = "appUserDto.userEnabled",target = "enabled")
    @Mapping(source = "appUserDto.userVerified",target = "verified")
    AppUser userDtoToUser(AppUserDto appUserDto, @MappingTarget AppUser appUser);

    @Mapping(source = "appUserRequestDto.userFirstName",target = "firstName")
    @Mapping(source = "appUserRequestDto.userLastName",target = "lastName")
    @Mapping(source = "appUserRequestDto.userUsername",target = "username")
    @Mapping(source = "appUserRequestDto.userEnabled",target = "enabled")
    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    AppUser userRequestDtoToUser(AppUserRequestDto appUserRequestDto,@MappingTarget AppUser appUser);


}