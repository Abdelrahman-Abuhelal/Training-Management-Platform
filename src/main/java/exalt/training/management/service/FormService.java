package exalt.training.management.service;


import exalt.training.management.dto.*;
import exalt.training.management.exception.FormNotFoundException;
import exalt.training.management.mapper.FormMapper;
import exalt.training.management.mapper.QuestionMapper;
import exalt.training.management.model.forms.Form;
import exalt.training.management.model.forms.Question;
import exalt.training.management.repository.*;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Slf4j
public class FormService {


    private final FormRepository formRepository;
    private final QuestionMapper questionMapper;
    private final FormMapper formMapper;
    private final QuestionRepository questionRepository;





    @Autowired
    public FormService(FormRepository formRepository, QuestionMapper questionMapper, QuestionRepository questionRepository, FormMapper formMapper) {
        this.formRepository = formRepository;
        this.questionMapper = questionMapper;
        this.questionRepository = questionRepository;
        this.formMapper = formMapper;
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

    public FormCreationDto getFormById(Long formId) {
        Form form = formRepository.findById(formId).orElseThrow(() -> new FormNotFoundException("Form not found with that ID"));
        return formMapper.formToFormCreationDto(form);
    }

    public List<FormDto> getAllForms(){
        List <Form> forms = formRepository.findAll();
        return formMapper.formListToFormDtoList(forms);
    }


    @Transactional
    public String updateForm(Long formId, FormDataDto formDataDto) {
        Form form = formRepository.findById(formId)
                .orElseThrow(() -> new FormNotFoundException("Form not found with that ID"));

        questionRepository.deleteAllByForm(form);

        // Map DTO questions to entities
        List<Question> questions = questionMapper.questionDtoListToQuestionList(formDataDto.getQuestions());

        // Update form details
        Form updatedForm = formMapper.formDataDtoToForm(formDataDto, form);
        updatedForm.setQuestions(questions);

        // Save form and questions
        formRepository.save(updatedForm);
        questions.forEach(question -> question.setForm(updatedForm));
        questionRepository.saveAll(questions);

        return "Form with title : " + updatedForm.getTitle() + " has been updated";
    }

//   public List <FormDataDto> getAllTraineeForms(){
//        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
//        var user = (AppUser) authentication.getPrincipal();
//        var trainee = user.getTrainee();
//        if(trainee == null){
//            throw new InvalidUserException("User is not a Trainee");
//        }
//        List <Form> forms =traineeService.findFormsByTraineeId(trainee.getId());
//       return formMapper.formCreationDtoListToFormList(forms);
//   }







//@Transactional
//   public String fillForm(FillFormDto fillFormDto, Long formId)
//   {
//       Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
//       var user = (AppUser) authentication.getPrincipal();
//
//
//       FormSubmission formSubmission=new FormSubmission();
//       Form form= formRepository.findById(formId).orElseThrow(()->new FormNotFoundException("No Review with this ID"));
//       formSubmission.setForm(form);
//
//       if(user.getRole().equals(AppUserRole.TRAINEE)){
//           formSubmission.setTrainee(user.getTrainee());
//       }else if(user.getRole().equals(AppUserRole.SUPERVISOR)){
//           formSubmission.setSupervisor(user.getSupervisor());
//        }else if(user.getRole().equals(AppUserRole.SUPER_ADMIN)){
//           formSubmission.setSuperAdmin(user.getSuperAdmin());
//       }
//       formSubmission.setAnswers(fillFormDto.getAnswers());
//       formSubmissionRepository.save(formSubmission);
//      return "Review has been updated";
//   }

/*    public ReviewDataDto getFormDataByFormId(Long formId){
        Review review = reviewRepository.findById(formId).orElseThrow(()->new FormNotFoundException("Form not found with the provided id"));
        return ReviewDataDto.builder().ratingsDto(ratingMapper.ratingToRatingDto(review.getRatings())).description(review.getDescription()).type(review.getType()).build();
    }*/


}
