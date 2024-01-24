package exalt.training.management.controller;


import exalt.training.management.dto.ChangePasswordRequest;
import exalt.training.management.dto.ConfirmedAccountResponse;
import exalt.training.management.dto.PasswordRequest;
import exalt.training.management.service.AppUserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/users")
@PreAuthorize("hasAnyRole('TRAINEE','SUPERVISOR','SUPER_ADMIN')")
public class AppUserController {

    private final AppUserService appUserService;

        @Operation(summary = "Comgitplete Your Registration (Confirmation-Token Required)", security =  @SecurityRequirement(name = "confirmationAuth"))
    @PostMapping(value="/complete-registration")
    public ResponseEntity<ConfirmedAccountResponse> confirmUserAccount(
            @RequestParam("email") String email,
            @Valid @RequestBody PasswordRequest passwordRequest) {
        return ResponseEntity.ok(appUserService.confirmAccount(email,passwordRequest));
    }

    @Operation(summary = "Change Password (Logged-in User)", security =  @SecurityRequirement(name = "loginAuth"))
    @PutMapping("/change-password")
    public ResponseEntity<String> changePassword(@RequestBody
                                                     @Valid ChangePasswordRequest changePasswordRequest, Principal user
    )  {
        return ResponseEntity.ok(appUserService.changePassword(changePasswordRequest, user));
    }





//   @PostMapping
//   public ResponseEntity<AppUserResponse> login(@RequestBody LoginRequestDto loginRequestDto) {
//       AppUserResponse userResponseDto = traineeRegistrationService.login(loginRequestDto);
//       return new ResponseEntity<>(userResponseDto, HttpStatus.OK);
//   }




}
