package exalt.training.management.controller;


import exalt.training.management.dto.ChangePasswordRequest;
import exalt.training.management.dto.ConfirmedAccountResponse;
import exalt.training.management.dto.PasswordRequest;
import exalt.training.management.service.AppUserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/users")
public class AppUserController {

    private final AppUserService appUserService;




/*    @PostMapping("/register")
    public ResponseEntity<String> registerTrainee(@RequestBody @Valid RegistrationRequest request
    ) {
        return ResponseEntity.ok(appUserService.registerUser(request));
    }*/


    @PostMapping(value="/complete-registration")
    public ResponseEntity<ConfirmedAccountResponse> confirmUserAccount(
            @RequestParam("email") String email,
            @Valid @RequestBody PasswordRequest passwordRequest) {
        return ResponseEntity.ok(appUserService.confirmAccount(email,passwordRequest));
    }
    @PutMapping("/change-password")
    public ResponseEntity<String> changePassword(@RequestBody
                                                     @Valid ChangePasswordRequest request, Principal user
    )  {
        return ResponseEntity.ok(appUserService.changePassword(request, user));
    }





//   @PostMapping
//   public ResponseEntity<AppUserResponse> login(@RequestBody LoginRequestDto loginRequestDto) {
//       AppUserResponse userResponseDto = traineeRegistrationService.login(loginRequestDto);
//       return new ResponseEntity<>(userResponseDto, HttpStatus.OK);
//   }




}
