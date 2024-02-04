package exalt.training.management.service;

import exalt.training.management.exception.InvalidTokenException;
import exalt.training.management.model.AppUser;
import exalt.training.management.model.Token;
import exalt.training.management.model.TokenType;
import exalt.training.management.repository.TokenRepository;
import jakarta.servlet.http.HttpServletRequest;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpHeaders;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.argThat;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)

public class AuthenticationServiceTests {

    @Mock
    private TokenRepository tokenRepository;

    @InjectMocks
    private  AuthenticationService authenticationService;


    @Test
    public void checkAuthHeader_ValidHeader_ReturnsJwt() {
        String expectedJwt = "valid-jwt";
        String validAuthHeader = "Bearer " + expectedJwt;

        // Mock request with valid header
        HttpServletRequest request = mock(HttpServletRequest.class);
        when(request.getHeader(HttpHeaders.AUTHORIZATION)).thenReturn(validAuthHeader);

        // Call the method under test
        String jwt = authenticationService.checkAuthHeader(request);

        // Assert expected JWT is returned
        assertEquals(expectedJwt, jwt);
    }

    @Test
    public void checkAuthHeader_MissingHeader_ThrowsException() {
        HttpServletRequest request = mock(HttpServletRequest.class);
        when(request.getHeader(HttpHeaders.AUTHORIZATION)).thenReturn(null);

        // Assert exception is thrown
        assertThrows(InvalidTokenException.class, () -> authenticationService.checkAuthHeader(request));
    }

    @Test
    public void checkAuthHeader_InvalidHeaderFormat_ThrowsException() {
        String invalidAuthHeader = "InvalidToken"; // Missing "Bearer " prefix
        HttpServletRequest request = mock(HttpServletRequest.class);
        when(request.getHeader(HttpHeaders.AUTHORIZATION)).thenReturn(invalidAuthHeader);

        // Assert exception is thrown
        assertThrows(InvalidTokenException.class, () -> authenticationService.checkAuthHeader(request));
    }

    @Test
    public void saveUserLoginToken_ValidUserAndToken_SavesTokenAndSetsExpiredAndRevokedFalse() {
        // Mock objects
        AppUser user = mock(AppUser.class);
        String jwtToken = "valid-jwt-token";
        Token token = mock(Token.class);  // Mock the Token object for verification
        when(tokenRepository.save(any())).thenReturn(token);  // Mock the saving behavior

        // Call the method under test
        authenticationService.saveUserLoginToken(user, jwtToken);

        // Verify token is saved with correct values
        verify(tokenRepository).save(argThat(t -> {
            return t.getUser().equals(user) &&
                    t.getToken().equals(jwtToken) &&
                    t.getTokenType() == TokenType.LOGIN &&
                    !t.isExpired() &&
                    !t.isRevoked();
        }));
    }

}
