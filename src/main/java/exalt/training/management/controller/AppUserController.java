package exalt.training.management.controller;


import exalt.training.management.dto.AppUserDto;
import exalt.training.management.dto.ChangePasswordRequest;
import exalt.training.management.service.AppUserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/users")
public class AppUserController {

    private final AppUserService appUserService;


    @PostMapping("/change-password")
    public ResponseEntity<String> changePassword(@RequestBody
                                                     @Valid ChangePasswordRequest request, Principal user
    )  {
        return ResponseEntity.ok(appUserService.changePassword(request, user));
    }


    @GetMapping
    public ResponseEntity<List<AppUserDto>> getAllUsers(){
        List<AppUserDto> userList= appUserService.getAllUsers();
        return new ResponseEntity<>(userList, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<AppUserDto> getUserById(@PathVariable Long id){
        AppUserDto userResponseDto= appUserService.getUserById(id);
        return new ResponseEntity<>(userResponseDto, HttpStatus.OK);
    }


//   @PostMapping
//   public ResponseEntity<AppUserResponse> login(@RequestBody LoginRequestDto loginRequestDto) {
//       AppUserResponse userResponseDto = traineeRegistrationService.login(loginRequestDto);
//       return new ResponseEntity<>(userResponseDto, HttpStatus.OK);
//   }




}
