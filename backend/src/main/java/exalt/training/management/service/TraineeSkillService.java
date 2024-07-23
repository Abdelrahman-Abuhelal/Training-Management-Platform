package exalt.training.management.service;

import exalt.training.management.model.TraineeSkill;
import exalt.training.management.repository.TraineeSkillRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TraineeSkillService {


    private final TraineeSkillRepository traineeSkillRepository;

    public TraineeSkillService(TraineeSkillRepository traineeSkillRepository) {
        this.traineeSkillRepository = traineeSkillRepository;
    }

    public List<TraineeSkill> getAllTraineeSkills() {
        return traineeSkillRepository.findAll();
    }

    public TraineeSkill addTraineeSkill(TraineeSkill traineeSkill) {
        return traineeSkillRepository.save(traineeSkill);
    }
}
