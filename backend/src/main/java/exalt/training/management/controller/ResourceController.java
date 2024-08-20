package exalt.training.management.controller;

import exalt.training.management.dto.ResourceAssignRequestDTO;
import exalt.training.management.dto.ResourceCreateRequestDTO;
import exalt.training.management.dto.ResourceDto;
import exalt.training.management.dto.ResourceResponseDTO;
import exalt.training.management.model.Resource;
import exalt.training.management.service.ResourceService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.FileSystemResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.io.File;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/resources")
@Slf4j
public class ResourceController {

    @Autowired
    private ResourceService resourceService;

    @PostMapping
    @PreAuthorize("hasAnyRole('SUPER_ADMIN','SUPERVISOR')")
    @Operation(summary = "Create resource", security = @SecurityRequirement(name = "loginAuth"))
    public ResourceResponseDTO createResource(@RequestBody ResourceCreateRequestDTO resourceCreateRequestDTO) {
        return resourceService.createResource(resourceCreateRequestDTO);
    }

    @PreAuthorize("hasAnyRole('SUPER_ADMIN','SUPERVISOR','TRAINEE')")
    @Operation(summary = "Download resource file", security = @SecurityRequirement(name = "loginAuth"))
    @GetMapping("/download/{id}")
    public ResponseEntity<byte[]> downloadResource(@PathVariable Long id) {
        Resource resource = resourceService.getResourceById(id); // Retrieve the resource
        if (resource.getResourceFile() == null) {
            return ResponseEntity.notFound().build();
        }

        byte[] fileData = resource.getResourceFile();
        if (fileData.length == 0) {
            return ResponseEntity.notFound().build();
        }
        String fileName = resource.getResourceName();
        log.info(fileName);

        if (!fileName.endsWith(".pdf")) {
            fileName += ".pdf";
        }
        log.info(fileName);

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + fileName + "\"")
                .contentLength(fileData.length)
                .contentType(MediaType.APPLICATION_PDF)
                .body(fileData);
    }


    @PutMapping("/{resourceId}/assign")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN','SUPERVISOR')")
    @Operation(summary = "Assign resource", security = @SecurityRequirement(name = "loginAuth"))
    public void assignResource(@PathVariable Long resourceId, @RequestBody ResourceAssignRequestDTO assignmentRequest) {
        resourceService.assignResourceToTrainees(resourceId, assignmentRequest);
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('SUPER_ADMIN','SUPERVISOR')")
    @Operation(summary = "Get all resources", security = @SecurityRequirement(name = "loginAuth"))
    public List<ResourceResponseDTO> getAllResources() {
        return resourceService.getAllResources();
    }

    @GetMapping("/{resourceId}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN','SUPERVISOR')")
    @Operation(summary = "Get resource by id", security = @SecurityRequirement(name = "loginAuth"))
    public ResourceResponseDTO getResourceById(@PathVariable Long resourceId) {
        return resourceService.getResourceResponseById(resourceId);
    }

    @DeleteMapping("/{resourceId}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN','SUPERVISOR')")
    @Operation(summary = "Delete resource by id", security = @SecurityRequirement(name = "loginAuth"))
    public ResponseEntity<Void> deleteResource(@PathVariable Long resourceId) {
        resourceService.deleteResource(resourceId);
        return ResponseEntity.noContent().build(); // Return a 204 No Content response
    }


    @PreAuthorize("hasAnyRole('SUPER_ADMIN','SUPERVISOR','TRAINEE')")
    @GetMapping("/trainees/{userId}")
    @Operation(summary = "Get resources by Trainee Id", security = @SecurityRequirement(name = "loginAuth"))
    public ResponseEntity<List<ResourceDto>> getResourcesByTraineeId(@PathVariable Long userId) {
        List<ResourceDto> resources = resourceService.getResourcesForTrainee(userId);
        return ResponseEntity.ok(resources);
    }
}
