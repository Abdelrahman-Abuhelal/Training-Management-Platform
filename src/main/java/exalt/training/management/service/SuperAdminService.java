package exalt.training.management.service;

import exalt.training.management.model.SuperAdmin;
import exalt.training.management.model.Supervisor;
import exalt.training.management.repository.SuperAdminRepository;
import exalt.training.management.repository.SupervisorRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
public class SuperAdminService {

    private final SuperAdminRepository superAdminRepository;

    public SuperAdminService(SuperAdminRepository superAdminRepository) {
        this.superAdminRepository = superAdminRepository;
    }


    public void saveSuperAdmin(SuperAdmin superAdmin){
        superAdminRepository.save(superAdmin);
    }
}
