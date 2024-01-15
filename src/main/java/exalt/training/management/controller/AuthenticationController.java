package exalt.training.management.controller;

import exalt.training.management.dto.AuthenticationResponse;
import exalt.training.management.dto.ConfirmedAccountResponse;
import exalt.training.management.dto.LoginRequest;
import exalt.training.management.dto.RegistrationRequest;
import exalt.training.management.service.AuthenticationService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthenticationController {

    private final AuthenticationService authService;


    // I should make one dto for registration then in the method specify the role
    @PostMapping("/register")
    public ResponseEntity<String> registerTrainee(@RequestBody @Valid RegistrationRequest request
    ) {
        return ResponseEntity.ok(authService.registerUser(request));
    }


    @PostMapping("/login")
    public ResponseEntity<AuthenticationResponse> authenticate(
            @RequestBody @Valid LoginRequest request
    ) {
        return ResponseEntity.ok(authService.authenticate(request));
    }

    @GetMapping(value="/confirm-account")
    public ResponseEntity<ConfirmedAccountResponse> confirmUserAccount(@RequestParam("token")String confirmationToken) {
        return ResponseEntity.ok(authService.confirmAccount(confirmationToken));
    }

    @PostMapping("/refresh-token")
    public void refreshToken(
            HttpServletRequest request,
            HttpServletResponse response
    ) throws IOException {
        authService.refreshToken(request, response);
    }

}