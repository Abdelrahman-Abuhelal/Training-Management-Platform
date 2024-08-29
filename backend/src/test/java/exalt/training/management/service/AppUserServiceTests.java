package exalt.training.management.service;

import exalt.training.management.dto.ChangePasswordRequest;
import exalt.training.management.dto.PasswordRequest;
import exalt.training.management.exception.AppUserNotFoundException;
import exalt.training.management.model.users.AppUser;

import exalt.training.management.repository.AppUserRepository;
import jakarta.servlet.http.HttpServletRequest;
import org.apache.tomcat.util.net.openssl.ciphers.Authentication;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class AppUserServiceTests {
    @InjectMocks
    private AppUserService appUserService;

    @Mock
    private AppUserRepository appUserRepository;


    @Mock
    private AuthenticationService authenticationService;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private TraineeService traineeService;

    @Mock
    private SupervisorService supervisorService;

    @Mock
    private SuperAdminService superAdminService;

    @Mock
    private TokenService tokenService;


//    @Test
//    public void testConfirmAccount_Success() throws Exception {
//        // Mock objects
//        HttpServletRequest request = mock(HttpServletRequest.class);
//        PasswordRequest passwordRequest = mock(PasswordRequest.class);
//        AppUser user = mock(AppUser.class);
//        TokenService tokenService = mock(TokenService.class);
//        AuthenticationService authenticationService = mock(AuthenticationService.class);
//
//        // Mock behavior
//        when(authenticationService.checkAuthHeader(request)).thenReturn("validToken");
//        when(tokenService.extractEmail("validToken")).thenReturn("user@example.com");
//        when(appUserRepository.findByEmail("user@example.com")).thenReturn(Optional.of(user));
//        when(tokenService.isConfirmationTokenValid("validToken")).thenReturn(true);
//        when(tokenService.isTokenValid("validToken", user)).thenReturn(true);
//        when(user.getActivated()).thenReturn(false);
//        when(passwordRequest.getNewPassword()).thenReturn("newPassword");
//        when(passwordRequest.getConfirmationPassword()).thenReturn("newPassword");
//
//        // Call the method
//        String response = appUserService.confirmAccount(request, passwordRequest);
//
//        // Assertions
//        assertEquals("Account has been activated", response);
//        verify(user).setPassword(anyString());
//        verify(user).setActivated(true);
//        verify(user).setVerified(true);
//        verify(appUserRepository).save(user);
//    }

//    @Test
//    public void changePassword_Success() {
//        // Mock objects
//        UserDetails userDetails = mock(UserDetails.class);
//        AppUser user = mock(AppUser.class);
//
//        // Mock SecurityContextHolder
//        SecurityContextHolder securityContextHolder = mock(SecurityContextHolder.class);
//        SecurityContext securityContext = mock(SecurityContext.class);
//
//        // Mock behavior
//        when(userDetails.getUsername()).thenReturn("user@example.com");
//        when(appUserRepository.findByEmail("user@example.com")).thenReturn(Optional.of(user));
//        when(passwordEncoder.matches("oldPassword", "encodedPassword")).thenReturn(true);
//        when(passwordEncoder.encode("newPassword")).thenReturn("encodedNewPassword");
//
//        when(securityContextHolder.getContext()).thenReturn(securityContext);
//        when(securityContext.getAuthentication()).thenReturn(new UsernamePasswordAuthenticationToken(userDetails, null, null));
//
//        // Set SecurityContextHolder
//        SecurityContextHolder.setContext((SecurityContext) securityContextHolder);
//
//        // Call the method
//        String response = appUserService.changePassword(new ChangePasswordRequest("oldPassword", "newPassword", "newPassword"));
//
//        // Assertions
//        assertEquals("Your password has been changed", response);
//        verify(user).setPassword("encodedNewPassword");
//        verify(appUserRepository).save(user);
//    }
    @Test
    public void testGetUserByEmail_Success() {
        AppUser user = mock(AppUser.class);

        when(appUserRepository.findByEmail("user@example.com")).thenReturn(Optional.of(user));

        AppUser retrievedUser = appUserService.getUserByEmail("user@example.com");

        assertSame(user, retrievedUser);
    }
//    @Test(expected = AppUserNotFoundException.class)
//    public void testGetUserByEmail_NotFound() {
//        // Mock behavior
//        when(appUserRepository.findByEmail("user@example.com")).thenReturn(Optional.empty());
//
//        // Call the method (expect exception)
//        appUserService.getUserByEmail("user@example.com");
//    }


    @Test
    public void testUsernameIsNotUnique_Exists() {
        // Mock behavior
        when(appUserRepository.existsByUsername("username")).thenReturn(true);

        // Call the method
        boolean exists = appUserService.usernameIsNotUnique("username");

        // Assertions
        assertTrue(exists);
    }
}