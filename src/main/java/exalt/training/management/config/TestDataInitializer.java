package exalt.training.management.config;

import exalt.training.management.model.AppUser;
import exalt.training.management.model.AppUserRole;
import exalt.training.management.repository.AppUserRepository;
import exalt.training.management.service.AdminService;
import exalt.training.management.service.AppUserService;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

@Component
public class TestDataInitializer implements ApplicationRunner {

    private final AdminService adminService;
    private final AppUserRepository appUserRepository;

    public TestDataInitializer(AdminService adminService, AppUserRepository appUserRepository) {
        this.adminService = adminService;
        this.appUserRepository = appUserRepository;
    }

    @Override
    public void run(ApplicationArguments args) throws Exception {
        // Create a test user and register them
        AppUser user = AppUser.builder()
                .email("abd.hilal14@gmail.com")
                .password("{bcrypt}$2a$10$GRLdNijSQMUvl/au9ofL.eDwmoohzzS7.rmNSJZ.0FxO/BTk76klW")
                .username("adasdasd")
                .role(AppUserRole.SUPER_ADMIN)
                .enabled(true)
                .firstName("Abdelrahman")
                .trainee(null)
                .build();

        appUserRepository.save(user);
    }
}
