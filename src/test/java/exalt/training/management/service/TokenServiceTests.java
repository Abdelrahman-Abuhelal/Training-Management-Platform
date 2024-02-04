package exalt.training.management.service;

import exalt.training.management.exception.InvalidTokenException;
import exalt.training.management.model.AppUser;
import exalt.training.management.model.Token;
import exalt.training.management.model.TokenType;
import exalt.training.management.repository.AppUserRepository;
import exalt.training.management.repository.TokenRepository;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Date;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
@ExtendWith(MockitoExtension.class)
public class TokenServiceTests {
    @Mock
    private TokenRepository tokenRepository;

    @InjectMocks
    private TokenService tokenService;


    @Test
    public void findByToken_ReturnsTokenIfFound() {
        // Arrange
        String token = "valid_token";
        Token expectedToken = Token.builder().token(token).build();
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
    @Test
    public void tokenExists_ReturnsTrueIfExists() {
        String token = "valid_token";
        Token expectedToken = new Token();

        when(tokenRepository.findByToken(token)).thenReturn(Optional.of(expectedToken));
        boolean tokenExists = tokenService.tokenExists(token);
        assertTrue(tokenExists);
        verify(tokenRepository).findByToken(token);

    }

    @Test
    public void isLoginTokenValid_ReturnsTrueForValidNonExpiredNonRevokedToken() {
        // Arrange
        String jwt = "valid_login_token";
        Token validToken = Token.builder().tokenType(TokenType.LOGIN).expired(false).revoked(false).build();
        when(tokenRepository.findTokenByTokenTypeAndToken(TokenType.LOGIN, jwt))
                .thenReturn(Optional.of(validToken));

        // Act
        boolean isValid = tokenService.isLoginTokenValid(jwt);

        // Assert
        assertTrue(isValid);
        verify(tokenRepository).findTokenByTokenTypeAndToken(TokenType.LOGIN, jwt);
    }
    @Test
    public void isLoginTokenValid_ReturnsFalseForInvalidToken() {
        // Arrange
        String jwt = "invalid_login_token";
        when(tokenRepository.findTokenByTokenTypeAndToken(TokenType.LOGIN, jwt))
                .thenReturn(Optional.empty()); // Simulate not found

        // Act
        boolean isValid = tokenService.isLoginTokenValid(jwt);

        // Assert
        assertFalse(isValid);
        verify(tokenRepository).findTokenByTokenTypeAndToken(TokenType.LOGIN, jwt);
    }

    @Test
    public void isLoginTokenValid_ReturnsFalseForExpiredToken() {
        // Arrange
        String jwt = "expired_login_token";
        Token expiredToken = Token.builder().expired(true).revoked(false).build(); // Expired
        when(tokenRepository.findTokenByTokenTypeAndToken(TokenType.LOGIN, jwt))
                .thenReturn(Optional.of(expiredToken));

        // Act
        boolean isValid = tokenService.isLoginTokenValid(jwt);

        // Assert
        assertFalse(isValid);
        verify(tokenRepository).findTokenByTokenTypeAndToken(TokenType.LOGIN, jwt);
    }

    @Test
    public void isLoginTokenValid_ReturnsFalseForRevokedToken() {
        // Arrange
        String jwt = "revoked_login_token";
        Token revokedToken = Token.builder().revoked(true).expired(false).build(); // Revoked
        when(tokenRepository.findTokenByTokenTypeAndToken(TokenType.LOGIN, jwt))
                .thenReturn(Optional.of(revokedToken));

        // Act
        boolean isValid = tokenService.isLoginTokenValid(jwt);

        // Assert
        assertFalse(isValid);
        verify(tokenRepository).findTokenByTokenTypeAndToken(TokenType.LOGIN, jwt);
    }




}
