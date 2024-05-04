package exalt.training.management.service;

import exalt.training.management.model.users.Supervisor;
import exalt.training.management.repository.SupervisorRepository;
import org.springframework.stereotype.Service;

@Service
public class SupervisorService {

    private final SupervisorRepository supervisorRepository;

    public SupervisorService(SupervisorRepository supervisorRepository) {
        this.supervisorRepository = supervisorRepository;
    }


    public void saveSupervisor(Supervisor supervisor){
        supervisorRepository.save(supervisor);
    }
}
