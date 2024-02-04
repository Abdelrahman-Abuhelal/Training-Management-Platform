package exalt.training.management.repository;

import exalt.training.management.model.Token;
import exalt.training.management.model.TokenType;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
@DataJpaTest

public class TokenRepositoryTests {
    @Autowired
    private TokenRepository tokenRepository;


    @Test
    public void findAllValidTokenByUser_ReturnsValidTokensForUser() {
        TokenRepository mock = org.mockito.Mockito.mock(TokenRepository.class);

        // Arrange
        Long userId = 1L;
        List<Token> expectedTokens = List.of(new Token(), new Token()); // Set up expected tokens
        when(mock.findAllValidTokenByUser(userId)).thenReturn(expectedTokens);

        // Act
        List<Token> retrievedTokens = mock.findAllValidTokenByUser(userId);

        // Assert
        assertEquals(expectedTokens, retrievedTokens);
        verify(mock).findAllValidTokenByUser(userId);
    }

    @Test
    public void findByToken_ReturnsTokenIfFound() {
        TokenRepository mock = org.mockito.Mockito.mock(TokenRepository.class);

        // Arrange
        String token = "valid_token";
        Optional<Token> expectedToken = Optional.of(new Token()); // Set up expected token
        when(mock.findByToken(token)).thenReturn(expectedToken);

        // Act
        Optional<Token> retrievedToken = mock.findByToken(token);

        // Assert
        assertEquals(expectedToken, retrievedToken);
        verify(mock).findByToken(token);
    }
    @Test
    public void findTokenByTokenTypeAndToken_ReturnsTokenIfFound() {
        TokenRepository mock = org.mockito.Mockito.mock(TokenRepository.class);

        // Arrange
       String token= "valid_token";
       TokenType tokenType = TokenType.LOGIN;
       Optional<Token> expectedToken = Optional.of(new Token());
       when(mock.findTokenByTokenTypeAndToken(tokenType,token)).thenReturn(expectedToken);
        // Act
        Optional<Token> retrievedToken = mock.findTokenByTokenTypeAndToken(tokenType,token);
        // Assert
        assertEquals(expectedToken, retrievedToken);
        verify(mock).findTokenByTokenTypeAndToken(tokenType, token);
    }

}
