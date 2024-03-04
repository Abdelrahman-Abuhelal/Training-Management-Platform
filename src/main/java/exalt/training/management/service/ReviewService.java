package exalt.training.management.service;

import exalt.training.management.dto.CompletedFormDto;
import exalt.training.management.dto.FillReviewDto;
import exalt.training.management.dto.ReviewCreationDto;
import exalt.training.management.dto.ReviewDataDto;
import exalt.training.management.exception.FormNotFoundException;
import exalt.training.management.exception.InvalidFormType;
import exalt.training.management.exception.InvalidUserException;
import exalt.training.management.mapper.ReviewMapper;
import exalt.training.management.model.AppUser;
import exalt.training.management.model.AppUserRole;
import exalt.training.management.model.Supervisor;
import exalt.training.management.model.Trainee;
import exalt.training.management.model.forms.Question;
import exalt.training.management.model.forms.Review;
import exalt.training.management.model.forms.ReviewSubmission;
import exalt.training.management.model.forms.ReviewType;
import exalt.training.management.repository.*;
import jakarta.transaction.Transactional;
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
    private final AdminService adminService;
    private final ReviewMapper reviewMapper;
    private final QuestionRepository questionRepository;

    private final TraineeRepository traineeRepository;
    private  final SupervisorRepository supervisorRepository;

    private final ReviewSubmissionRepository reviewSubmissionRepository;

    private final TraineeService traineeService;


    @Autowired
    public ReviewService(ReviewRepository reviewRepository, AdminService adminService, QuestionRepository questionRepository, TraineeRepository traineeRepository, ReviewMapper reviewMapper, SupervisorRepository supervisorRepository, ReviewSubmissionRepository reviewSubmissionRepository, TraineeService traineeService) {
        this.reviewRepository = reviewRepository;
        this.adminService = adminService;
        this.questionRepository = questionRepository;
        this.traineeRepository = traineeRepository;
        this.reviewMapper = reviewMapper;
        this.supervisorRepository = supervisorRepository;
        this.reviewSubmissionRepository = reviewSubmissionRepository;
        this.traineeService = traineeService;
    }

/*
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
        String reviewType= completedFormDto.getType();
        if (!ReviewType.isValid(reviewType)){
            throw new InvalidFormType("Invalid Form Type");
        }
        var description=completedFormDto.getDescription();
        List<Rating> ratings = ratingMapper.ratingDtoListToRatingList(completedFormDto.getRatingsDto());
        ratings.forEach(rating -> rating.setReview(savedReview));
        ratingService.saveRatings(ratings);
        savedReview.setRatings(ratings);
        savedReview.setType(ReviewType.valueOf(reviewType));
        savedReview.setDescription(description);
        reviewRepository.save(savedReview);
        return "Form registered successfully!";
    }
*/

    public String createReviewForm(ReviewCreationDto reviewDto){
        var targetAudience= reviewDto.getTargetAudience();
        List<Question> questions = reviewDto.getQuestions();

        Review review= reviewMapper.reviewCreationDtoToReview(reviewDto);
        reviewRepository.save(review);

        questions.forEach(question -> question.setReview(review));
        questionRepository.saveAll(questions);

        if("trainees".equals(targetAudience)){
           List <Trainee> trainees= adminService.getAllTrainees();
           trainees.forEach(trainee -> trainee.getReviews().add(review));
           traineeRepository.saveAll(trainees);
        }
        else if ("supervisors".equals(targetAudience)) {
            List<Supervisor> supervisors = adminService.getAllSupervisors();
            supervisors.forEach(supervisor -> supervisor.getReviews().add(review));
            supervisorRepository.saveAll(supervisors);
        }// add the admin part, I Don't have time.

        return "Review Form has been created";
    }

    public ReviewDataDto getReviewById(Long reviewId) {
        Review review = reviewRepository.findById(reviewId).orElseThrow(() -> new FormNotFoundException("Review no found with that ID"));
        return ReviewDataDto.builder().id(review.getId()).title(review.getTitle()).description(review.getDescription()).questions(review.getQuestions()).build();
    }

    public List<ReviewDataDto> getAllReviews(){
        List <Review> reviews = reviewRepository.findAll();
        return reviewMapper.reviewCreationDtoListToReviewList(reviews);
    }

   public List <ReviewDataDto> getAllTraineeReviews(){
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        var user = (AppUser) authentication.getPrincipal();
        var trainee = user.getTrainee();
        if(trainee == null){
            throw new InvalidUserException("User is not a Trainee");
        }
        List <Review> reviews =traineeService.findReviewsByTraineeId(trainee.getId());
       return reviewMapper.reviewCreationDtoListToReviewList(reviews);
   }
@Transactional
   public String fillReview(FillReviewDto fillReviewDto,Long reviewId)
   {
       Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
       var user = (AppUser) authentication.getPrincipal();


       ReviewSubmission reviewSubmission=new ReviewSubmission();
       Review review= reviewRepository.findById(reviewId).orElseThrow(()->new FormNotFoundException("No Review with this ID"));
       reviewSubmission.setReview(review);

       if(user.getRole().equals(AppUserRole.TRAINEE)){
           reviewSubmission.setTrainee(user.getTrainee());
       }else if(user.getRole().equals(AppUserRole.SUPERVISOR)){
       reviewSubmission.setSupervisor(user.getSupervisor());
        }else if(user.getRole().equals(AppUserRole.SUPER_ADMIN)){
           reviewSubmission.setSuperAdmin(user.getSuperAdmin());
       }
       reviewSubmission.setAnswers(fillReviewDto.getAnswers());
       reviewSubmissionRepository.save(reviewSubmission);
      return "Review has been updated";
   }

/*    public ReviewDataDto getFormDataByFormId(Long formId){
        Review review = reviewRepository.findById(formId).orElseThrow(()->new FormNotFoundException("Form not found with the provided id"));
        return ReviewDataDto.builder().ratingsDto(ratingMapper.ratingToRatingDto(review.getRatings())).description(review.getDescription()).type(review.getType()).build();
    }*/


}
