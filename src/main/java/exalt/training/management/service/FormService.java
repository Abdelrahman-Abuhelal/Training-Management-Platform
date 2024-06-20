package exalt.training.management.service;


import exalt.training.management.dto.FillFormDto;
import exalt.training.management.dto.FormCreationDto;
import exalt.training.management.dto.FormDataDto;
import exalt.training.management.exception.FormNotFoundException;
import exalt.training.management.exception.InvalidUserException;
import exalt.training.management.mapper.FormMapper;
import exalt.training.management.model.forms.Form;
import exalt.training.management.model.forms.FormSubmission;
import exalt.training.management.model.users.AppUser;
import exalt.training.management.model.users.AppUserRole;
import exalt.training.management.model.forms.Question;
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
public class FormService {


    private final FormRepository formRepository;
    private final AdminService adminService;
    private final FormMapper formMapper;
    private final QuestionRepository questionRepository;

    private final TraineeRepository traineeRepository;
    private  final SupervisorRepository supervisorRepository;

    private final FormSubmissionRepository formSubmissionRepository;

    private final TraineeService traineeService;


    @Autowired
    public FormService(FormRepository formRepository, AdminService adminService, QuestionRepository questionRepository, TraineeRepository traineeRepository, FormMapper formMapper, SupervisorRepository supervisorRepository, FormSubmissionRepository formSubmissionRepository, TraineeService traineeService) {
        this.formRepository = formRepository;
        this.adminService = adminService;
        this.questionRepository = questionRepository;
        this.traineeRepository = traineeRepository;
        this.formMapper = formMapper;
        this.supervisorRepository = supervisorRepository;
        this.formSubmissionRepository = formSubmissionRepository;
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

    public String createForm(FormCreationDto formDto){
        List<Question> questions = formDto.getQuestions();

        Form form= formMapper.formCreationDtoToForm(formDto);
        formRepository.save(form);

        questions.forEach(question -> question.setForm(form));
        questionRepository.saveAll(questions);

        return "Review Form has been created";
    }

    public FormDataDto getFormById(Long formId) {
        Form form = formRepository.findById(formId).orElseThrow(() -> new FormNotFoundException("Form not found with that ID"));
        return FormDataDto.builder().id(form.getId()).title(form.getTitle()).description(form.getDescription()).questions(form.getQuestions()).build();
    }

    public List<FormDataDto> getAllForms(){
        List <Form> forms = formRepository.findAll();
        return formMapper.formCreationDtoListToFormList(forms);
    }

   public List <FormDataDto> getAllTraineeForms(){
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        var user = (AppUser) authentication.getPrincipal();
        var trainee = user.getTrainee();
        if(trainee == null){
            throw new InvalidUserException("User is not a Trainee");
        }
        List <Form> forms =traineeService.findFormsByTraineeId(trainee.getId());
       return formMapper.formCreationDtoListToFormList(forms);
   }
@Transactional
   public String fillForm(FillFormDto fillFormDto, Long formId)
   {
       Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
       var user = (AppUser) authentication.getPrincipal();


       FormSubmission formSubmission=new FormSubmission();
       Form form= formRepository.findById(formId).orElseThrow(()->new FormNotFoundException("No Review with this ID"));
       formSubmission.setForm(form);

       if(user.getRole().equals(AppUserRole.TRAINEE)){
           formSubmission.setTrainee(user.getTrainee());
       }else if(user.getRole().equals(AppUserRole.SUPERVISOR)){
           formSubmission.setSupervisor(user.getSupervisor());
        }else if(user.getRole().equals(AppUserRole.SUPER_ADMIN)){
           formSubmission.setSuperAdmin(user.getSuperAdmin());
       }
       formSubmission.setAnswers(fillFormDto.getAnswers());
       formSubmissionRepository.save(formSubmission);
      return "Review has been updated";
   }

/*    public ReviewDataDto getFormDataByFormId(Long formId){
        Review review = reviewRepository.findById(formId).orElseThrow(()->new FormNotFoundException("Form not found with the provided id"));
        return ReviewDataDto.builder().ratingsDto(ratingMapper.ratingToRatingDto(review.getRatings())).description(review.getDescription()).type(review.getType()).build();
    }*/


}
