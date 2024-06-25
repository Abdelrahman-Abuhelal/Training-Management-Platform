package exalt.training.management.repository;


import exalt.training.management.model.users.AppUser;
import exalt.training.management.model.users.AppUserRole;
import org.assertj.core.api.Assertions;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@DataJpaTest
public class AppUserRepositoryTests {
    @Autowired
    private AppUserRepository appUserRepository;

    @Test
    public void appUserRepository_SaveAppUser_ReturnsSavedUser() {
    // arrange
        AppUser appUser = AppUser.builder()
                .firstName("Abd").lastName("abuhilal")
                .email("abd.hilal14@gmail.com").enabled(true)
                .role(AppUserRole.TRAINEE).password("abd1423@#").build();
    // act
       AppUser savedAppUser = appUserRepository.save(appUser);
    // assert
        Assertions.assertThat(savedAppUser).isNotNull();
        Assertions.assertThat(savedAppUser.getId()).isGreaterThan(0);
        Assertions.assertThat(savedAppUser.getImageUrl()).isNull();
    }

    @Test
    public void existsByUsername_ReturnsTrueForExistingUsername() {
        AppUserRepository mock = org.mockito.Mockito.mock(AppUserRepository.class);

        // Arrange
        String existingUsername = "johndoe@gmail.com";
        when(mock.existsByUsername(existingUsername)).thenReturn(true);
        // Act and Assert
        assertTrue(mock.existsByUsername(existingUsername));
        verify(mock).existsByUsername(existingUsername);
    }

    @Test
    public void existsByUsername_ReturnsFalseForNonExistingUsername() {
        // Arrange
        AppUserRepository mock = org.mockito.Mockito.mock(AppUserRepository.class);

        String nonExistingUsername = "randomuser";
        when(mock.existsByUsername(nonExistingUsername)).thenReturn(false);

        // Act and Assert
        assertFalse(mock.existsByUsername(nonExistingUsername));
        verify(mock).existsByUsername(nonExistingUsername);
    }
    @Test
    public void findByRole_ReturnsUsersWithMatchingRole() {

        AppUserRepository mock = org.mockito.Mockito.mock(AppUserRepository.class);
        // Arrange
        AppUserRole role = AppUserRole.TRAINEE;
        List<AppUser> expectedUsers = List.of(new AppUser(), new AppUser()); // Set up expected users
        when(mock.findByRole(role)).thenReturn(Optional.of(expectedUsers));

        // Act
        Optional<List<AppUser>> retrievedUsers = mock.findByRole(role);

        // Assert
        assertTrue(retrievedUsers.isPresent());
        assertEquals(expectedUsers, retrievedUsers.get());
        verify(mock).findByRole(role);
    }

    @Test
    public void findByRole_ReturnsEmptyOptionalForNonExistingRole() {
        AppUserRepository mock = org.mockito.Mockito.mock(AppUserRepository.class);

        // Arrange
        AppUserRole role = AppUserRole.SUPER_ADMIN; // Assuming no users with this role
        when(mock.findByRole(role)).thenReturn(Optional.empty());

        // Act
        Optional<List<AppUser>> retrievedUsers = mock.findByRole(role);

        // Assert
        assertTrue(retrievedUsers.isEmpty());
        verify(mock).findByRole(role);
    }





}
