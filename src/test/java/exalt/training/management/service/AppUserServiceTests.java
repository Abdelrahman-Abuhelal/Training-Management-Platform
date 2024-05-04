package exalt.training.management.service;

import exalt.training.management.exception.AppUserNotFoundException;
import exalt.training.management.model.users.AppUser;

import exalt.training.management.repository.AppUserRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class AppUserServiceTests {
    @Mock
    private AppUserRepository appUserRepository;

    @InjectMocks
    private AppUserService appUserService;


    @Test
    public void userAlreadyExists_ReturnsTrue() {
        // Arrange
        String existingUsername = "abd.hilal14@gmail.com";
        when(appUserRepository.findByEmail(existingUsername)).thenReturn(Optional.of(new AppUser()));

        // Act
        boolean userExists = appUserService.userAlreadyExists(existingUsername);

        // Assert
        assertTrue(userExists);
        verify(appUserRepository).findByEmail(existingUsername); // Verify repository interaction
    }

    @Test
    public void userAlreadyExists_ReturnsFalse() {
        // Arrange
        String nonExistingUsername = "somerandomemail@example.com";
        when(appUserRepository.findByEmail(nonExistingUsername)).thenReturn(Optional.empty());

        // Act
        boolean userExists = appUserService.userAlreadyExists(nonExistingUsername);

        // Assert
        assertFalse(userExists);
        verify(appUserRepository).findByEmail(nonExistingUsername); // Verify repository interaction
    }


    @Test
    public void getUserByEmail_ReturnsUser() {
        // Arrange
        String existingEmail = "abd.hilal14@gmail.com";
        AppUser expectedUser = new AppUser(); // Set up necessary fields as needed
        when(appUserRepository.findByEmail(existingEmail)).thenReturn(Optional.of(expectedUser));

        // Act
        AppUser retrievedUser = appUserService.getUserByEmail(existingEmail);

        // Assert
        assertSame(expectedUser, retrievedUser); // Ensure the exact same instance is returned
        verify(appUserRepository).findByEmail(existingEmail); // Verify repository interaction
    }

    @Test
    public void getUserByEmail_ThrowsExceptionForNonExistingUser() {
        // Arrange
        String nonExistingEmail = "somerandomemail@example.com";
        when(appUserRepository.findByEmail(nonExistingEmail)).thenReturn(Optional.empty());

        // Act and Assert
        assertThrows(AppUserNotFoundException.class, () -> appUserService.getUserByEmail(nonExistingEmail));
        verify(appUserRepository).findByEmail(nonExistingEmail); // Verify repository interaction
    }



}