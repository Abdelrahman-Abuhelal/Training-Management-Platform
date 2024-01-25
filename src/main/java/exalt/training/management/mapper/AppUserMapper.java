package exalt.training.management.mapper;


import exalt.training.management.dto.AppUserDto;
import exalt.training.management.dto.AppUserRequestDto;
import exalt.training.management.model.AppUser;
import exalt.training.management.model.AppUserRole;
import jakarta.persistence.Column;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.validation.constraints.Size;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.factory.Mappers;

import java.util.List;


// try to find constant way for doing it in pom.xml
// @Mapper(componentModel = "spring")
@Mapper(componentModel = "spring")
public interface AppUserMapper {

    AppUserMapper INSTANCE = Mappers.getMapper(AppUserMapper.class);

    @Mapping(source = "appUser.id",target = "userId")
    @Mapping(source = "appUser.email",target = "userEmail")
    @Mapping(source = "appUser.role",target = "userRole")
    @Mapping(source = "appUser.firstName",target = "userFirstName")
    AppUserDto userToUserDto(AppUser appUser);

    @Mapping(source = "appUser.id",target = "userId")
    @Mapping(source = "appUser.email",target = "userEmail")
    @Mapping(source = "appUser.role",target = "userRole")
    @Mapping(source = "appUser.firstName",target = "userFirstName")
    List<AppUserDto> userToUserDto(List<AppUser> appUser);
    @Mapping(source = "appUserDto.userId",target = "id")
    @Mapping(source = "appUserDto.userEmail",target = "email")
    @Mapping(source = "appUserDto.userRole",target = "role")
    @Mapping(source = "appUserDto.userFirstName",target = "firstName")
    AppUser userDtoToUser(AppUserDto appUserDto);

    @Mapping(source = "appUserDto.userId",target = "id")
    @Mapping(source = "appUserDto.userEmail",target = "email")
    @Mapping(source = "appUserDto.userRole",target = "role")
    @Mapping(source = "appUserDto.userFirstName",target = "firstName")
    AppUser userDtoToUser(AppUserDto appUserDto, @MappingTarget AppUser appUser);

    @Mapping(source = "appUserRequestDto.email",target = "email")
    @Mapping(source = "appUserRequestDto.role",target = "role")
    @Mapping(source = "appUserRequestDto.firstName",target = "firstName")
    @Mapping(source = "appUserRequestDto.lastName",target = "lastName")
    @Mapping(source = "appUserRequestDto.fullName",target = "fullName")
    @Mapping(source = "appUserRequestDto.username",target = "username")
    @Mapping(source = "appUserRequestDto.imageUrl",target = "imageUrl")
    @Mapping(source = "appUserRequestDto.enabled",target = "enabled")
    AppUser userRequestDtoToUser(AppUserRequestDto appUserRequestDto,@MappingTarget AppUser appUser);


}