package exalt.training.management.service;
import exalt.training.management.exception.InvalidTokenException;
import exalt.training.management.model.AppUser;
import exalt.training.management.model.Token;
import exalt.training.management.model.TokenType;
import exalt.training.management.repository.TokenRepository;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import java.security.Key;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.stereotype.Service;

@Service
@Slf4j
public class TokenService {

    @Value("${application.security.jwt.secret-key}")
    private String secretKey;
    @Value("${application.security.jwt.login-token.expiration}")
    private long loginExpiration;
    @Value("${application.security.jwt.forgot-pass-token.expiration}")
    private long forgotPasswordExpiration;
    @Value("${application.security.jwt.confirmation-token.expiration}")
    private long confirmationExpiration;
    @Value("${application.security.jwt.refresh-token.expiration}")
    private long refreshExpiration;

    private final TokenRepository tokenRepository;

    public TokenService(TokenRepository tokenRepository) {
        this.tokenRepository = tokenRepository;
    }


    public Token findByToken(String token){
        return tokenRepository.findByToken(token).orElseThrow(
                ()-> new InvalidTokenException("Token is not Valid"));
    }

    public boolean isConfirmationTokenValid(String jwt) {
        return tokenRepository.findTokenByTokenTypeAndToken(TokenType.CONFIRMATION_TOKEN, jwt)
                .map(t -> !t.isExpired() && !t.isRevoked())
                .orElse(false);
    }

    public boolean isForgetPasswordTokenValid(String jwt) {
        return tokenRepository.findTokenByTokenTypeAndToken(TokenType.FORGOT_PASS, jwt)
                .map(t -> !t.isExpired() && !t.isRevoked())
                .orElse(false);
    }

    public boolean isLoginTokenValid(String jwt) {
        return tokenRepository.findTokenByTokenTypeAndToken(TokenType.LOGIN, jwt)
                .map(t -> !t.isExpired() && !t.isRevoked())
                .orElse(false);
    }

    public boolean tokenExists(String token){
        return tokenRepository.findByToken(token).isPresent();
    }

    public String extractEmail(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    public String generateLogin(AppUser user) {
        return generateLoginToken(new HashMap<>(), user);
    }
    public String generateConfirmation(AppUser user) {
        return generateConfirmationToken(new HashMap<>(), user);
    }
    public String generateForgotPassword(AppUser user) {
        return generateForgotPasswordToken(new HashMap<>(), user);
    }

    public String generateLoginToken(
            Map<String, Object> extraClaims,
            AppUser user
    ) {
        return buildToken(extraClaims, user, loginExpiration);
    }

    public String generateForgotPasswordToken(
            Map<String, Object> extraClaims,
            AppUser user
    ) {
        return buildToken(extraClaims, user, forgotPasswordExpiration);
    }

    public String generateConfirmationToken(
            Map<String, Object> extraClaims,
            AppUser user
    ) {
        return buildToken(extraClaims, user, confirmationExpiration);
    }

    public String generateRefreshToken(
            AppUser user
    ) {
        return buildToken(new HashMap<>(), user, refreshExpiration);
    }

    private String buildToken(
            Map<String, Object> extraClaims,
            AppUser user,
            long expiration
    ) {
        return Jwts
                .builder()
                .setClaims(extraClaims)
                .setSubject(user.getEmail())
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + expiration))
                .signWith(getSignInKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    //ensure that the username extracted from the database is the same exist in database
    public boolean isTokenValid(String token, AppUser user) {
        final String email = extractEmail(token);
        return (email.equals(user.getEmail())) && !isTokenExpired(token);
    }

    private boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }

    private Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }

    private Claims extractAllClaims(String token) {
        return Jwts
                .parserBuilder()
                .setSigningKey(getSignInKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    private Key getSignInKey() {
        byte[] keyBytes = Decoders.BASE64.decode(secretKey);
        return Keys.hmacShaKeyFor(keyBytes);
    }

    public Token findByUserAndTokenType(AppUser user, TokenType tokenType) {
       return tokenRepository.findByUserAndTokenType(user, tokenType).orElseThrow(
                ()-> new InvalidTokenException("Token is not Valid"));
    }
    public void revokeToken(Token token) {
        token.setRevoked(true);
        tokenRepository.save(token);
    }
}