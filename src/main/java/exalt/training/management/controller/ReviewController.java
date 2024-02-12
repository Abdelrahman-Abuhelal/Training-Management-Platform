package exalt.training.management.controller;

import exalt.training.management.dto.CompletedFormDto;
import exalt.training.management.dto.ReviewDataDto;
import exalt.training.management.service.ReviewService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/reviews")
public class ReviewController {


    private final ReviewService reviewService;

    @PostMapping("/completed-review")
    @PreAuthorize("hasAnyRole('TRAINEE','SUPERVISOR','SUPER_ADMIN')")
    @Operation(summary = "Register Form Data" , security =  @SecurityRequirement(name = "loginAuth"))
    public ResponseEntity<String> registerFormData(@RequestBody @Valid CompletedFormDto completedFormDto) {
        return ResponseEntity.ok(reviewService.registerFormData(completedFormDto));
    }

    @GetMapping("/{reviewId}")
    @PreAuthorize("hasAnyRole('TRAINEE','SUPERVISOR','SUPER_ADMIN')")
    @Operation(summary = "Register Form Data" , security =  @SecurityRequirement(name = "loginAuth"))
    public ResponseEntity<ReviewDataDto> getFormDataByFormId(@PathVariable Long reviewId) {
        return ResponseEntity.ok(reviewService.getFormDataByFormId(reviewId));
    }

}
