package exalt.training.management.controller;

import exalt.training.management.dto.*;
import exalt.training.management.service.AdminService;
import exalt.training.management.service.AuthenticationService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotEmpty;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthenticationController {

    private final AuthenticationService authService;
    private final AdminService adminService;


    // I should make one dto for registration then in the method specify the role


    @PostMapping("/login")
    public ResponseEntity<AuthenticationResponse> authenticate(
            @RequestBody @Valid LoginRequest request
    ) {
        return ResponseEntity.ok(authService.authenticate(request));
    }


// should be in the admin APIs but for testing now

    @PutMapping(value="/password-reset")
    public ResponseEntity<String> confirmPassword(@RequestParam("token")String forgotPasswordToken,
                                                  @Valid @RequestBody PasswordRequest passwordRequest) {
        return ResponseEntity.ok(authService.changePasswordViaEmail(forgotPasswordToken,passwordRequest));
    }

    @PostMapping("forgot-password")
    public ResponseEntity<String> forgotPassword(@Email(message = "Please provide a valid email address")
                                                   @RequestParam  String email){
       return ResponseEntity.ok(authService.forgotPasswordViaEmail(email));
    }

    @PostMapping("/refresh-token")
    public void refreshToken(
            HttpServletRequest request,
            HttpServletResponse response
    ) throws IOException {
        authService.refreshToken(request, response);
    }





}