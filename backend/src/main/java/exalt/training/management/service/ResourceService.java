package exalt.training.management.service;

import exalt.training.management.dto.*;
import exalt.training.management.exception.InvalidUserException;
import exalt.training.management.exception.ResourceNotFoundException;
import exalt.training.management.model.Resource;
import exalt.training.management.model.ResourceAssignment;
import exalt.training.management.model.TrainingPlan;
import exalt.training.management.model.users.AppUser;
import exalt.training.management.model.users.Supervisor;
import exalt.training.management.model.users.Trainee;
import exalt.training.management.repository.*;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class ResourceService {

    @Autowired
    private ResourceRepository resourceRepository;

    @Autowired
    private ResourceAssignmentRepository resourceAssignmentRepository;

    @Autowired
    private TraineeRepository traineeRepository;

    @Autowired
    private AppUserRepository appUserRepository;

    // Create a new resource
    public ResourceResponseDTO createResource(@Valid ResourceCreateRequestDTO resourceRequest) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        var user = (AppUser) authentication.getPrincipal();
        var supervisor = user.getSupervisor();
        if (supervisor == null) {
            throw new InvalidUserException("User is not a Supervisor");
        }

        Resource resource = Resource.builder()
                .resourceName(resourceRequest.getResourceName())
                .description(resourceRequest.getDescription())
                .resourceType(resourceRequest.getResourceType())
                .resourceFile(resourceRequest.getResourceFile())
                .resourceUrl(resourceRequest.getResourceUrl())
                .supervisor(supervisor)
                .build();

        Resource savedResource = resourceRepository.save(resource);
        return mapToResponseDTO(savedResource);
    }

    // Assign trainees to a resource
    public void assignResourceToTrainees(Long resourceId, @Valid ResourceAssignRequestDTO assignmentRequest) {
        Resource resource = resourceRepository.findById(resourceId)
                .orElseThrow(() -> new ResourceNotFoundException("Resource not found"));

        for (Long userId : assignmentRequest.getUserIds()) {
            Optional<AppUser> userOptional = appUserRepository.findById(userId);
            if (userOptional.isPresent()) {
                AppUser appUser = userOptional.get();
                Trainee trainee = appUser.getTrainee();
                if (trainee != null) {
                    ResourceAssignment assignment = new ResourceAssignment();
                    assignment.setResource(resource);
                    assignment.setTrainee(trainee);
                    resourceAssignmentRepository.save(assignment);
                }
            } else {
                throw new RuntimeException("User not found");
            }
        }
    }

    public List<ResourceResponseDTO> getAllResources() {
        List<Resource> resources = resourceRepository.findAll();
        return resources.stream()
                .map(this::mapToResponseDTO)
                .collect(Collectors.toList());
    }

    public List<ResourceResponseDTO> getMyResourcesBySupervisor() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        var user = (AppUser) authentication.getPrincipal();
        var supervisor = user.getSupervisor();
        if (supervisor == null) {
            throw new InvalidUserException("User is not a Supervisor");
        }
        List<Resource> resources = resourceRepository.findBySupervisorId(supervisor.getId());
        return resources.stream()
                .map(this::mapToResponseDTO)
                .collect(Collectors.toList());
    }


    public List<ResourceDto> getMyResources() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        var user = (AppUser) authentication.getPrincipal();
        var trainee = user.getTrainee();

        if (trainee == null) {
            throw new InvalidUserException("User is not a Trainee");
        }

        List<ResourceAssignment> assignments = resourceAssignmentRepository.findByTraineeId(trainee.getId());
        if (assignments.isEmpty()) {
            throw new ResourceNotFoundException("No resources assigned to this trainee");
        }

        List<Resource> resources = assignments.stream()
                .map(ResourceAssignment::getResource)
                .toList();

        return resources.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public List<ResourceResponseDTO> getResourcesBySupervisor() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        var user = (AppUser) authentication.getPrincipal();
        var supervisor = user.getSupervisor();

        if (supervisor == null) {
            throw new InvalidUserException("User is not a Supervisor");
        }

        List<Resource> resources = resourceRepository.findBySupervisorId(supervisor.getId());

        return resources.stream()
                .map(this::mapToResponseDTO)
                .collect(Collectors.toList());
    }

    public ResourceResponseDTO getResourceResponseById(Long resourceId) {
        Resource resource = resourceRepository.findById(resourceId)
                .orElseThrow(() -> new ResourceNotFoundException("Resource not found"));
        return mapToResponseDTO(resource);
    }


    public Resource getResourceById(Long resourceId) {
        Resource resource = resourceRepository.findById(resourceId)
                .orElseThrow(() -> new ResourceNotFoundException("Resource not found"));
        return resource;
    }

    public void deleteResource(Long resourceId) {
        Resource resource = resourceRepository.findById(resourceId)
                .orElseThrow(() -> new ResourceNotFoundException("Resource not found"));
        resourceRepository.delete(resource);
    }


    private ResourceDto convertToDto(Resource resource) {
        return ResourceDto.builder()
                .id(resource.getId())
                .resourceName(resource.getResourceName())
                .description(resource.getDescription())
                .resourceType(resource.getResourceType())
                .resourceUrl(resource.getResourceUrl())
                .supervisorId(resource.getSupervisor().getId())
                .build();
    }
    private ResourceResponseDTO mapToResponseDTO(Resource resource) {
        Set<Long> traineeIds = resourceAssignmentRepository.findByResource(resource)
                .stream()
                .map(assignment -> assignment.getTrainee().getId())
                .collect(Collectors.toSet());

        return ResourceResponseDTO.builder()
                .id(resource.getId())
                .resourceName(resource.getResourceName())
                .description(resource.getDescription())
                .resourceType(resource.getResourceType())
                .resourceUrl(resource.getResourceUrl())
                .supervisorId(resource.getSupervisor().getId())
                .traineeIds(traineeIds)
                .build();
    }
}
