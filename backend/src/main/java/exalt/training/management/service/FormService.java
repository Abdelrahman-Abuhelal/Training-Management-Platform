package exalt.training.management.service;


import exalt.training.management.dto.*;
import exalt.training.management.exception.AppUserNotFoundException;
import exalt.training.management.exception.FormNotFoundException;
import exalt.training.management.mapper.AnswerMapper;
import exalt.training.management.mapper.FormMapper;
import exalt.training.management.mapper.QuestionMapper;
import exalt.training.management.model.forms.Answer;
import exalt.training.management.model.forms.Form;
import exalt.training.management.model.forms.FormSubmission;
import exalt.training.management.model.forms.Question;
import exalt.training.management.model.users.AppUser;
import exalt.training.management.repository.*;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Service
@Slf4j
public class FormService {


    private final FormRepository formRepository;
    private final QuestionMapper questionMapper;
    private final FormMapper formMapper;
    private final QuestionRepository questionRepository;
    private final AnswerMapper answerMapper;
    private final AppUserRepository appUserRepository;

    private final FormSubmissionRepository formSubmissionRepository;
private final AnswerRepository answerRepository;



    @Autowired
    public FormService(FormRepository formRepository, QuestionMapper questionMapper, QuestionRepository questionRepository, FormMapper formMapper, AnswerMapper answerMapper, AppUserRepository appUserRepository, FormSubmissionRepository formSubmissionRepository, AnswerRepository answerRepository) {
        this.formRepository = formRepository;
        this.questionMapper = questionMapper;
        this.questionRepository = questionRepository;
        this.formMapper = formMapper;
        this.answerMapper = answerMapper;
        this.appUserRepository = appUserRepository;
        this.formSubmissionRepository = formSubmissionRepository;
        this.answerRepository = answerRepository;
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

    public String createForm(FormDataDto formDataDto){
        List<Question> questions = questionMapper.questionDtoListToQuestionList(formDataDto.getQuestions());

        Form form= formMapper.formDataDtoToForm(formDataDto);
        form.setQuestions(questions);
        formRepository.save(form);

        questions.forEach(question -> question.setForm(form));
        questionRepository.saveAll(questions);

        return "Review Form has been created";
    }

    public String deleteForm(Long formId){
        if(!formRepository.existsById(formId)){
            throw new FormNotFoundException(String.format("Form with this %s ID number doesn't exist",formId));
        }
        formRepository.deleteById(formId);
        return "Form with ID " + formId +" has been deleted";
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

        List<Question> questions = questionMapper.questionDtoListToQuestionList(formDataDto.getQuestions());

        Form updatedForm = formMapper.formDataDtoToForm(formDataDto, form);
        updatedForm.setQuestions(questions);

        formRepository.save(updatedForm);
        questions.forEach(question -> question.setForm(updatedForm));
        questionRepository.saveAll(questions);

        return "Form with title : " + updatedForm.getTitle() + " has been updated";
    }

    public String sendFormToUsers(Long formId,List<Long>userIds){
        Form form = formRepository.findById(formId)
                .orElseThrow(() -> new FormNotFoundException("Form not found with that ID"));

        List <AppUser>existingUsers= form.getUsersAssignedTo();
        List<AppUser> newUsers = appUserRepository.findAllById(userIds);

        Set<AppUser> allUsers = new HashSet<>(existingUsers);
        allUsers.addAll(newUsers);

        form.setUsersAssignedTo(new ArrayList<>(allUsers));

        formRepository.save(form);
        return "Form sent successfully to users with IDs: " + userIds;
    }

    public List<Long> getUsersFormIsAssignedTo(Long formId){
        Form form = formRepository.findById(formId)
                .orElseThrow(() -> new FormNotFoundException("Form not found with that ID"));
        List<Long> userIds = form.getUsersAssignedTo().stream()
                .map(AppUser::getId)
                .collect(Collectors.toList());

        return userIds;   }

    public List<Form> getMyForms() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();

        Optional<AppUser> optionalUser = appUserRepository.findByUsername(username);
        if (optionalUser.isPresent()) {
            AppUser user = optionalUser.get();
            return user.getForms();
        }

        return Collections.emptyList();
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







   public String fillForm(List<AnswerDto> answers, Long formId)
   {
       Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
       var user = (AppUser) authentication.getPrincipal();
       if (user==null) {
           throw new AppUserNotFoundException("User is not authenticated!");
       }
       FormSubmission formSubmission=new FormSubmission();

       Form form= formRepository.findById(formId).orElseThrow(()->new FormNotFoundException("No Review with this ID"));
        List<Answer> answersList = answerMapper.answerDtoListToAnswerList(answers);
        answerRepository.saveAll(answersList);
       formSubmission.setForm(form);
       formSubmission.setUser(user);
       formSubmission.setAnswers(answersList);
       formSubmissionRepository.save(formSubmission);
      return "Form has been updated";
   }

/*    public ReviewDataDto getFormDataByFormId(Long formId){
        Review review = reviewRepository.findById(formId).orElseThrow(()->new FormNotFoundException("Form not found with the provided id"));
        return ReviewDataDto.builder().ratingsDto(ratingMapper.ratingToRatingDto(review.getRatings())).description(review.getDescription()).type(review.getType()).build();
    }*/


}
