package exalt.training.management.controller;

import exalt.training.management.dto.*;
import exalt.training.management.model.forms.Review;
import exalt.training.management.model.users.Trainee;
import exalt.training.management.service.ReviewService;
import exalt.training.management.service.SupervisorService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/supervisor")
public class SupervisorController {


    private final SupervisorService supervisorService;


    @GetMapping( "/my-trainees")
    @PreAuthorize("hasAnyRole('SUPERVISOR')")
    @Operation(summary = "Get Supervisor's Trainees " , security =  @SecurityRequirement(name = "loginAuth"))
    public ResponseEntity <List<AppUserDto>> getSupervisorTrainees() {
        List<AppUserDto> trainees = supervisorService.getSupervisorTrainees();
        return ResponseEntity.ok(trainees);
    }




}
