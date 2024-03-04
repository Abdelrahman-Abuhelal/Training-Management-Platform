package exalt.training.management.controller;

import exalt.training.management.dto.CompletedFormDto;
import exalt.training.management.dto.FillReviewDto;
import exalt.training.management.dto.ReviewCreationDto;
import exalt.training.management.dto.ReviewDataDto;
import exalt.training.management.model.forms.Review;
import exalt.training.management.service.ReviewService;
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
@RequestMapping("/api/v1/reviews")
public class ReviewController {


    private final ReviewService reviewService;


    @PostMapping( "/create-review")
    @PreAuthorize("hasAnyRole('SUPERVISOR','SUPER_ADMIN')")
    @Operation(summary = "Create Review by Admin" , security =  @SecurityRequirement(name = "loginAuth"))
    public ResponseEntity<String> createReview(@RequestBody @Valid ReviewCreationDto reviewCreationDto) {
        return ResponseEntity.ok(reviewService.createReviewForm(reviewCreationDto));
    }


    @GetMapping("/{reviewId}")
    @PreAuthorize("hasAnyRole('TRAINEE','SUPERVISOR','SUPER_ADMIN')")
    @Operation(summary = "Get Review Info By ID" , security =  @SecurityRequirement(name = "loginAuth"))
    public ResponseEntity<ReviewDataDto> getReviewById(@PathVariable Long reviewId) {
        return ResponseEntity.ok(reviewService.getReviewById(reviewId));
    }

    @GetMapping()
    @PreAuthorize("hasAnyRole('SUPER_ADMIN')")
    @Operation(summary = "Get All Reviews (Admin Only)" , security =  @SecurityRequirement(name = "loginAuth"))
    public ResponseEntity <List<ReviewDataDto>> getAllReviews() {
        return ResponseEntity.ok(reviewService.getAllReviews());
    }


    @PutMapping("/{reviewId}")
    @PreAuthorize("hasAnyRole('TRAINEE','SUPERVISOR','SUPER_ADMIN')")
    public ResponseEntity <String> fillReviewById(@RequestBody FillReviewDto fillReviewDto, @PathVariable Long reviewId){
        return ResponseEntity.ok(reviewService.fillReview(fillReviewDto,reviewId));
    }


/*

    @PostMapping("/completed-review")
    @PreAuthorize("hasAnyRole('TRAINEE','SUPERVISOR','SUPER_ADMIN')")
    @Operation(summary = "Register Form Data" , security =  @SecurityRequirement(name = "loginAuth"))
    public ResponseEntity<String> registerFormData(@RequestBody @Valid CompletedFormDto completedFormDto) {
        return ResponseEntity.ok(reviewService.registerFormData(completedFormDto));
    }
*/
/*
    @GetMapping("/{reviewId}")
    @PreAuthorize("hasAnyRole('TRAINEE','SUPERVISOR','SUPER_ADMIN')")
    @Operation(summary = "Get Form Data" , security =  @SecurityRequirement(name = "loginAuth"))
    public ResponseEntity<ReviewDataDto> getFormDataByFormId(@PathVariable Long reviewId) {
        return ResponseEntity.ok(reviewService.getFormDataByFormId(reviewId));
    }*/

}
