//package exalt.training.management.controller;
//
//import exalt.training.management.model.DriveAccessToken;
//import exalt.training.management.model.users.AppUser;
//import exalt.training.management.repository.DriveAccessTokenRepository;
//import jakarta.servlet.http.HttpServletRequest;
//import jakarta.servlet.http.HttpServletResponse;
//import lombok.RequiredArgsConstructor;
//import lombok.extern.slf4j.Slf4j;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.beans.factory.annotation.Value;
//import org.springframework.http.*;
//import org.springframework.security.core.Authentication;
//import org.springframework.security.core.context.SecurityContextHolder;
//import org.springframework.util.LinkedMultiValueMap;
//import org.springframework.util.MultiValueMap;
//import org.springframework.web.bind.annotation.GetMapping;
//import org.springframework.web.bind.annotation.RequestMapping;
//import org.springframework.web.bind.annotation.RequestParam;
//import org.springframework.web.bind.annotation.RestController;
//import org.springframework.web.client.RestTemplate;
//
//import java.io.IOException;
//import java.util.Base64;
//import java.util.Map;
//import java.util.concurrent.ConcurrentHashMap;
//
//@RestController
//@RequestMapping("/api/v1/auth2")
//@RequiredArgsConstructor
//@Slf4j
//public class OAuth2Controller {
//
//    // Inject OAuth 2.0 client properties
//    @Value("${spring.security.oauth2.client.registration.google.client-id}")
//    private String clientId;
//
//    @Value("${spring.security.oauth2.client.registration.google.client-secret}")
//    private String clientSecret;
//
//    @Value("${spring.security.oauth2.client.registration.google.redirect-uri}")
//    private String redirectUri;
//
//    @Value("${spring.security.oauth2.client.registration.google.scope}")
//    private String scopes;
//
//    @Autowired
//    private final RestTemplate restTemplate;
//
//    private final DriveAccessTokenRepository driveAccessTokenRepository;
//
//
//    private final Map<String, String> tokenStore = new ConcurrentHashMap<>(); // Token store in memory
//
//
//    @GetMapping("/authorize/google")
//    public void authorizeWithGoogle(HttpServletRequest request, HttpServletResponse response) throws  IOException {
//        // Redirect supervisors to Google's authorization page
//        // Construct the authorization URL with client ID, redirect URI, and scopes
//        String authorizationUrl = "https://accounts.google.com/o/oauth2/auth" +
//                "?client_id=" + clientId +
//                "&redirect_uri=" + redirectUri +
//                "&response_type=code" +
//                "&scope=" + scopes;
//        log.debug(authorizationUrl);
//        response.sendRedirect(authorizationUrl);
//    }
//
//    @GetMapping("/callback/google")
//    public void handleGoogleCallback(@RequestParam("code") String code) {
//        String tokenUrl = "https://oauth2.googleapis.com/token";
//        MultiValueMap<String, String> params = new LinkedMultiValueMap<>();
//        params.add("code", code);
//        params.add("client_id", clientId);
//        params.add("client_secret", clientSecret);
//        params.add("redirect_uri", redirectUri);
//        params.add("grant_type", "authorization_code");
//
//        HttpHeaders headers = new HttpHeaders();
//        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);
//
//        HttpEntity<MultiValueMap<String, String>> request = new HttpEntity<>(params, headers);
//
//        ResponseEntity<Map> responseEntity = restTemplate.postForEntity(tokenUrl, request, Map.class);
//
//        if (responseEntity.getStatusCode() == HttpStatus.OK) {
//            Map<String, Object> responseBody = responseEntity.getBody();
//            String accessToken = (String) responseBody.get("access_token");
//            // Store the access token securely, e.g., encrypt and store in memory
//            storeToken(accessToken);
//        } else {
//            // Handle error response
//            // Log error or return appropriate feedback to supervisors
//        }
//    }
//
//
//    private void storeToken(String accessToken) {
//        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
//        var user = (AppUser) authentication.getPrincipal();
//        Long userId= user.getId();
//
//        String encryptedToken = encryptToken(accessToken);
//
//        DriveAccessToken token = new DriveAccessToken();
//        token.setId(userId);
//        token.setDriveAccessToken(encryptedToken);
//        driveAccessTokenRepository.save(token);    }
//
//    private String encryptToken(String accessToken) {
//        // Simple encryption example (replace with a secure encryption algorithm in production)
//        return Base64.getEncoder().encodeToString(accessToken.getBytes());
//    }
//}
