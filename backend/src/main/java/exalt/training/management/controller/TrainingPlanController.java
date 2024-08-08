package exalt.training.management.controller;

import exalt.training.management.model.TrainingPlan;
import exalt.training.management.service.TrainingPlanService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/trainingPlan")
@Slf4j
public class TrainingPlanController {
    @Autowired
    private TrainingPlanService trainingPlanService;

    @PostMapping
    public TrainingPlan createTrainingPlan(@RequestBody TrainingPlan trainingPlan) {
        return trainingPlanService.createTrainingPlan(trainingPlan);
    }

    @GetMapping("/trainee/{traineeId}")
    public List<TrainingPlan> getTrainingPlansByTrainee(@PathVariable Long traineeId) {
        return trainingPlanService.getTrainingPlansByTrainee(traineeId);
    }

}
