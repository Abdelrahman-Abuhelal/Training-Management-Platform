package exalt.training.management.controller;


import exalt.training.management.dto.ChangePasswordRequest;
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



    @Operation(summary = "Change Password (Logged-in User)", security =  @SecurityRequirement(name = "loginAuth"))
    @PutMapping("/change-password")
    public ResponseEntity<String> changePassword(@RequestBody
                                                     @Valid ChangePasswordRequest changePasswordRequest
    )  {
        return ResponseEntity.ok(appUserService.changePassword(changePasswordRequest));
    }

    // i want to create a endpoint to take object and add it to the trainee table, and use the login token to find the user who is in the system









//   @PostMapping
//   public ResponseEntity<AppUserResponse> login(@RequestBody LoginRequestDto loginRequestDto) {
//       AppUserResponse userResponseDto = traineeRegistrationService.login(loginRequestDto);
//       return new ResponseEntity<>(userResponseDto, HttpStatus.OK);
//   }




}
