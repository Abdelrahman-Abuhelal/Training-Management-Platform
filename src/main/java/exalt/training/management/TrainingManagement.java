package exalt.training.management;

import exalt.training.management.dto.LoginRequest;
import exalt.training.management.model.AppUser;
import exalt.training.management.model.AppUserRole;
import exalt.training.management.repository.AppUserRepository;
import exalt.training.management.service.AdminService;
import exalt.training.management.service.AuthenticationService;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
@RequiredArgsConstructor
public class TrainingManagement {

    private final AppUserRepository appUserRepository;

    public static void main(String[] args) {
        SpringApplication.run(TrainingManagement.class, args);
    }



/*
    @Bean
    public CommandLineRunner commandLineRunner(
            AuthenticationService service
    ) {
        return args -> {
            AppUser user = AppUser.builder()
                    .email("abd.hilal14@gmail.com")
                    .password("$2a$10$GRLdNijSQMUvl/au9ofL.eDwmoohzzS7.rmNSJZ.0FxO/BTk76klW")
                    .username("adasdasd")
                    .role(AppUserRole.SUPER_ADMIN)
                    .enabled(true)
                    .firstName("Abdelrahman")
                    .lastName("Abuhelal")
                    .trainee(null)
                    .build();
            appUserRepository.save(user);

            LoginRequest loginRequest=new LoginRequest(user.getEmail(),user.getPassword());
            System.out.println("Admin token: " + service.authenticate(loginRequest).getAccessToken());



        };
    }*/


}
