package exalt.training.management.service;

import exalt.training.management.model.TrainingPlan;
import exalt.training.management.repository.TrainingPlanRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TrainingPlanService {

    @Autowired
    private TrainingPlanRepository trainingPlanRepository;

    public TrainingPlan createTrainingPlan(TrainingPlan trainingPlan) {
        return trainingPlanRepository.save(trainingPlan);
    }

    public List<TrainingPlan> getTrainingPlansByTrainee(Long traineeId) {
        return trainingPlanRepository.findByTraineeId(traineeId);
    }

    // Additional methods for updating and deleting training plans can be added here
}
