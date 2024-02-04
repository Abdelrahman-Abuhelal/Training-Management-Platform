package exalt.training.management.service;

import exalt.training.management.exception.InvalidTokenException;
import exalt.training.management.model.AppUser;
import exalt.training.management.model.Token;
import exalt.training.management.repository.AppUserRepository;
import exalt.training.management.repository.TokenRepository;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

public class TokenServiceTests {
    @Mock
    private TokenRepository tokenRepository;

    @InjectMocks
    private TokenService tokenService;


    @Test
    public void findByToken_ReturnsTokenIfFound() {
        // Arrange
        String token = "valid_token";
        Token expectedToken = new Token();
        when(tokenRepository.findByToken(token)).thenReturn(Optional.of(expectedToken));

        // Act
        Token retrievedToken = tokenService.findByToken(token);

        // Assert
        assertEquals(expectedToken, retrievedToken);
        verify(tokenRepository).findByToken(token);
    }

    @Test
    public void findByToken_ThrowsInvalidTokenExceptionIfNotFound() {
        // Arrange
        String token = "invalid_token";
        when(tokenRepository.findByToken(token)).thenReturn(Optional.empty());

        // Assert
        assertThrows(InvalidTokenException.class, () -> tokenService.findByToken(token));
        verify(tokenRepository).findByToken(token);
    }




}
