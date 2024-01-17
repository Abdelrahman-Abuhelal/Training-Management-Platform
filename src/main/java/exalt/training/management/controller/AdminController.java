package exalt.training.management.controller;

import exalt.training.management.dto.ChangePasswordRequest;
import exalt.training.management.service.AdminService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/admins")
public class AdminController {


    private final AdminService adminService;


    @PutMapping("/deactivate-user/{id}")
    public ResponseEntity<String> deactivateUser(@PathVariable Long id)  {
        return ResponseEntity.ok(adminService.deactivateUser(id));
    }

}
