package exalt.training.management.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class GoogleDriveFolderResponse {

    private List<GoogleDriveFolder> folders;
    // Getters and setters
    public List<GoogleDriveFolder> getFolders() {
        return folders;
    }

    public void setFolders(List<GoogleDriveFolder> folders) {
        this.folders = folders;
    }
}
