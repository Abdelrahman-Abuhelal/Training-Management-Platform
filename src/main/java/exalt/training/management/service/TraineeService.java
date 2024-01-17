package exalt.training.management.service;

import exalt.training.management.model.Trainee;
import exalt.training.management.repository.TraineeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class TraineeService {

    private final TraineeRepository traineeRepository;


    public void saveTrainee(Trainee trainee){
        traineeRepository.save(trainee);
    }


}
