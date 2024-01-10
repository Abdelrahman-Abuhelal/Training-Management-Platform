package com.example.training.service;

import com.example.training.dto.AppUserResponse;
import com.example.training.exception.AppUserNotFoundException;
import com.example.training.mapper.AppUserMapper;
import com.example.training.model.AppUser;
import com.example.training.repository.AppUserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AppUserService {

    private final AppUserRepository appUserRepository;
    private final AppUserMapper appUserMapper;

    public AppUserResponse getUserById(Long id){
        AppUser appUser = appUserRepository.findById(id).orElseThrow(()-> new AppUserNotFoundException("There is no user with this ID: "+ id));
        return appUserMapper.userToUserDto(appUser);
    }

    public List<AppUserResponse> getAllUsers(){
        List<AppUser>users= appUserRepository.findAll();
        if (users.isEmpty()){
            throw new AppUserNotFoundException("There are no Users in the System");
        }
        return appUserMapper.userToUserDto(users);
    }





}
