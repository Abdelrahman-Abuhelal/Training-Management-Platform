package exalt.training.management.service;

import exalt.training.management.dto.GoogleDriveFolder;
import exalt.training.management.dto.GoogleDriveFolderResponse;
import exalt.training.management.model.users.AppUser;
import exalt.training.management.repository.DriveAccessTokenRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.Base64;
import java.util.List;

@Service
public class GoogleDriveService {

    @Autowired
    private RestTemplate restTemplate;

    private final DriveAccessTokenRepository driveAccessTokenRepository;

    @Value("${google.drive.api.base-url}")
    private String baseUrl;

    public GoogleDriveService(RestTemplate restTemplate, DriveAccessTokenRepository driveAccessTokenRepository) {
        this.restTemplate = restTemplate;
        this.driveAccessTokenRepository = driveAccessTokenRepository;
    }

    public List<GoogleDriveFolder> getFolders() {
        // Fetch Google Drive folders using access token
        String accessToken = retrieveAccessToken(); // Retrieve access token from tokenStore or database
        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(accessToken);
        HttpEntity<?> requestEntity = new HttpEntity<>(headers);
        ResponseEntity<GoogleDriveFolderResponse> responseEntity = restTemplate.exchange(
                baseUrl + "/folders", // API endpoint to fetch folders
                HttpMethod.GET,
                requestEntity,
                GoogleDriveFolderResponse.class
        );
        if (responseEntity.getStatusCode() == HttpStatus.OK) {
            return responseEntity.getBody().getFolders();
        } else {
            throw new RuntimeException("Failed to fetch Google Drive folders");
        }
    }

    private String retrieveAccessToken() {
        // Retrieve access token from tokenStore or database
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        var user = (AppUser) authentication.getPrincipal();
        Long userId= user.getId();
        String encryptedToken = driveAccessTokenRepository.findById(userId).get().getDriveAccessToken();

        // Decrypt token (reverse of encryption process)
        String accessToken = new String(Base64.getDecoder().decode(encryptedToken));
        return accessToken;
    }
}
