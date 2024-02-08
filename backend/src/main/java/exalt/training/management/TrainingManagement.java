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
public class TrainingManagement {


    public static void main(String[] args) {
        SpringApplication.run(TrainingManagement.class, args);
    }




}
