package exalt.training.management.controller;

import exalt.training.management.dto.ChangePasswordRequest;
import exalt.training.management.model.AppUser;
import exalt.training.management.service.AppUserService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;

import java.util.List;

import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.is;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AppUserControllerTests {

    @Mock
    private AppUserService appUserService;

    @InjectMocks
    private AppUserController appUserController;

    @Test
    void changePassword_shouldCallServiceAndReturnSuccessMessage() {
        // Set up mock authentication
        SecurityContextHolder.getContext().setAuthentication(
                new UsernamePasswordAuthenticationToken("username", "password",
                        List.of(new SimpleGrantedAuthority("TRAINEE"))));

        ChangePasswordRequest request = new ChangePasswordRequest("password", "newPassword","newPassword");
        when(appUserService.changePassword(request)).thenReturn("Password changed successfully");

        ResponseEntity<String> response = appUserController.changePassword(request);

        assertThat(response.getStatusCodeValue(), is(200));
        assertThat(response.getBody(), is("Password changed successfully"));
    }

    // Add tests for other controller endpoints, including the planned trainee endpoint
}
