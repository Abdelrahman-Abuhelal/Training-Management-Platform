package exalt.training.management.service;

import exalt.training.management.model.users.SuperAdmin;
import exalt.training.management.repository.SuperAdminRepository;
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
