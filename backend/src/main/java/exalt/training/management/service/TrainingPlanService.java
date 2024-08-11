package exalt.training.management.service;

import exalt.training.management.dto.TrainingPlanAssignRequestDTO;
import exalt.training.management.dto.TrainingPlanCreateRequestDTO;
import exalt.training.management.dto.TrainingPlanResponseDTO;
import exalt.training.management.exception.InvalidUserException;
import exalt.training.management.model.TrainingPlan;
import exalt.training.management.model.TrainingPlanAssignment;
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
public class TrainingPlanService {

    @Autowired
    private TrainingPlanRepository trainingPlanRepository;

    @Autowired
    private TrainingPlanAssignmentRepository trainingPlanAssignmentRepository;

    @Autowired
    private TraineeRepository traineeRepository;

    @Autowired
    private AppUserRepository appUserRepository;

    // Create a new training plan
    public TrainingPlanResponseDTO createTrainingPlan(@Valid TrainingPlanCreateRequestDTO trainingPlanRequest) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        var user = (AppUser) authentication.getPrincipal();
        var supervisor = user.getSupervisor();
        if (supervisor == null) {
            throw new InvalidUserException("User is not a Supervisor");
        }

        TrainingPlan trainingPlan = TrainingPlan.builder()
                .planFile(trainingPlanRequest.getPlanFile())
                .fileName(trainingPlanRequest.getFileName())
                .supervisor(supervisor)
                .build();

        TrainingPlan savedPlan = trainingPlanRepository.save(trainingPlan);
        return mapToResponseDTO(savedPlan);
    }

    // Assign trainees to a training plan
    public void assignTrainingPlanToTrainees(Long planId, @Valid TrainingPlanAssignRequestDTO assignmentRequest) {
        TrainingPlan trainingPlan = trainingPlanRepository.findById(planId)
                .orElseThrow(() -> new RuntimeException("Training Plan not found"));

        for (Long userId : assignmentRequest.getUserIds()) {
            Optional<AppUser> userOptional = appUserRepository.findById(userId);
            if (userOptional.isPresent()) {
                AppUser appUser = userOptional.get();
                Trainee trainee = appUser.getTrainee();
                if (trainee != null) {
                    TrainingPlanAssignment assignment = new TrainingPlanAssignment();
                    assignment.setTrainingPlan(trainingPlan);
                    assignment.setTrainee(trainee);
                    trainingPlanAssignmentRepository.save(assignment);
                }
            } else {
                throw new RuntimeException("User not found");
            }
        }
    }

    public List<TrainingPlanResponseDTO> getAllTrainingPlans() {
        List<TrainingPlan> trainingPlans = trainingPlanRepository.findAll();
        return trainingPlans.stream()
                .map(this::mapToResponseDTO)
                .collect(Collectors.toList());
    }

    // Get training plans by supervisor
    public List<TrainingPlanResponseDTO> getTrainingPlansBySupervisor() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        var user = (AppUser) authentication.getPrincipal();
        var supervisor = user.getSupervisor();
        if (supervisor == null) {
            throw new InvalidUserException("User is not a Supervisor");
        }
        List<TrainingPlan> trainingPlans = trainingPlanRepository.findBySupervisorId(supervisor.getId());
        return trainingPlans.stream()
                .map(this::mapToResponseDTO)
                .collect(Collectors.toList());
    }

    public TrainingPlanResponseDTO getTrainingPlanById(Long planId) {
        TrainingPlan trainingPlan = trainingPlanRepository.findById(planId)
                .orElseThrow(() -> new RuntimeException("Training Plan not found"));
        return mapToResponseDTO(trainingPlan);
    }

    public void deleteTrainingPlan(Long planId) {
        TrainingPlan trainingPlan = trainingPlanRepository.findById(planId)
                .orElseThrow(() -> new RuntimeException("Training Plan not found"));
        trainingPlanRepository.delete(trainingPlan);
    }





    private TrainingPlanResponseDTO mapToResponseDTO(TrainingPlan trainingPlan) {
        Set<Long> traineeIds = trainingPlanAssignmentRepository.findByTrainingPlan(trainingPlan)
                .stream()
                .map(assignment -> assignment.getTrainee().getId())
                .collect(Collectors.toSet());

        return TrainingPlanResponseDTO.builder()
                .id(trainingPlan.getId())
                .fileName(trainingPlan.getFileName())
                .supervisorId(trainingPlan.getSupervisor().getId())
                .traineeIds(traineeIds)
                .planFile(trainingPlan.getPlanFile()) // Include the file content
                .build();
    }

}
