package exalt.training.management.controller;

import exalt.training.management.dto.*;
import exalt.training.management.service.AdminService;
import exalt.training.management.service.AppUserService;
import exalt.training.management.service.AuthenticationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotEmpty;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthenticationController {

    private final AuthenticationService authService;
    private final AppUserService appUserService;


    // I should make one dto for registration then in the method specify the role

    @Operation(summary = "Login User (Email and Password)")
    @PostMapping("/login")
    public ResponseEntity<AuthenticationResponse> authenticate(
            @RequestBody @Valid LoginRequest request
    ) {
        return ResponseEntity.ok(authService.authenticate(request));
    }



// should be in the admin APIs but for testing now
    @Operation(summary = "Confirm New Password" , security =  @SecurityRequirement(name = "forgotPasswordAuth"))
    @PutMapping(value="/forgot-password-reset")
    public ResponseEntity<String> confirmPassword(HttpServletRequest request,
                                                  @Valid @RequestBody PasswordRequest passwordRequest) throws IOException {
        return ResponseEntity.ok(authService.changePasswordViaEmail(request,passwordRequest));
    }

    @Operation(summary = "Send a Reset Password Email (Not Logged-in User)")
    @PostMapping("forgot-password-email")
    public ResponseEntity<String> forgotPassword(@RequestBody  ForgotPasswordEmail forgotPasswordEmail){
       return ResponseEntity.ok(authService.forgotPasswordViaEmail(forgotPasswordEmail));
    }

    @PostMapping("/refresh-token")
    public ResponseEntity<AuthenticationResponse> refreshToken(HttpServletRequest request) {
        final String authHeader = request.getHeader(HttpHeaders.AUTHORIZATION);
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.badRequest().build();
        }

        String refreshToken = authHeader.substring(7);
        AuthenticationResponse authResponse = authService.refreshToken(refreshToken);

        if (authResponse != null) {
            return ResponseEntity.ok(authResponse);
        } else {
            return ResponseEntity.badRequest().build();
        }
    }


    @Operation(summary = "Complete Your Registration (Confirmation-Token Required)", security =  @SecurityRequirement(name = "confirmationAuth") )
    @PostMapping(value="/complete-registration")
    public ResponseEntity<String> confirmUserAccount(HttpServletRequest request,
                                                     @Valid @RequestBody PasswordRequest passwordRequest) {
        return ResponseEntity.ok(appUserService.confirmAccount(request,passwordRequest));
    }





}