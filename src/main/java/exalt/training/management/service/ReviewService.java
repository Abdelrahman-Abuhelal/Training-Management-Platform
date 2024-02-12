package exalt.training.management.service;

import exalt.training.management.dto.CompletedFormDto;
import exalt.training.management.dto.ReviewDataDto;
import exalt.training.management.exception.FormNotFoundException;
import exalt.training.management.exception.InvalidFormType;
import exalt.training.management.mapper.RatingMapper;
import exalt.training.management.model.AppUser;
import exalt.training.management.model.forms.Rating;
import exalt.training.management.model.forms.Review;
import exalt.training.management.model.forms.ReviewType;
import exalt.training.management.repository.ReviewRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@Slf4j
public class ReviewService {


    private final ReviewRepository reviewRepository;

    private final RatingMapper ratingMapper;
    private final RatingService ratingService;


    @Autowired
    public ReviewService(ReviewRepository reviewRepository, RatingMapper ratingMapper, RatingService ratingService) {
        this.reviewRepository = reviewRepository;
        this.ratingMapper = ratingMapper;
        this.ratingService = ratingService;
    }

    public String registerFormData(CompletedFormDto completedFormDto){
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        var user = (AppUser) authentication.getPrincipal();
        Review review = new Review();
        switch (user.getRole()){
            case TRAINEE:
                review.setTrainee(user.getTrainee());
                break;
            case SUPERVISOR:
                review.setSupervisor(user.getSupervisor());
                break;
            case SUPER_ADMIN:
                review.setSuperAdmin(user.getSuperAdmin());
                break;
        }
        Review savedReview = reviewRepository.save(review);
        String formType= completedFormDto.getType();
        if (!ReviewType.isValid(formType)){
            throw new InvalidFormType("Invalid Form Type");
        }
        var description=completedFormDto.getDescription();
        List<Rating> ratings = ratingMapper.ratingDtoListToRatingList(completedFormDto.getRatingsDto());
        ratings.forEach(rating -> rating.setReview(savedReview));
        ratingService.saveRatings(ratings);
        savedReview.setRatings(ratings);
        savedReview.setType(ReviewType.valueOf(formType));
        savedReview.setDescription(description);
        reviewRepository.save(savedReview);
        return "Form registered successfully!";
    }

    public ReviewDataDto getFormDataByFormId(Long formId){
        Review review = reviewRepository.findById(formId).orElseThrow(()->new FormNotFoundException("Form not found with the provided id"));
        return ReviewDataDto.builder().ratingsDto(ratingMapper.ratingToRatingDto(review.getRatings())).description(review.getDescription()).type(review.getType()).build();
    }


}
