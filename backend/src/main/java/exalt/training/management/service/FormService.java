package exalt.training.management.service;


import exalt.training.management.dto.*;
import exalt.training.management.exception.AppUserNotFoundException;
import exalt.training.management.exception.FormNotFoundException;
import exalt.training.management.mapper.AnswerMapper;
import exalt.training.management.mapper.FormMapper;
import exalt.training.management.mapper.QuestionMapper;
import exalt.training.management.model.forms.*;
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
    private final AnswerService answerService;
    private final FormSubmissionRepository formSubmissionRepository;
    private final AnswerRepository answerRepository;
    private final UserFormStatusRepository userFormStatusRepository;


    @Autowired
    public FormService(FormRepository formRepository, QuestionMapper questionMapper, QuestionRepository questionRepository, FormMapper formMapper, AnswerMapper answerMapper, AppUserRepository appUserRepository, AnswerService answerService, FormSubmissionRepository formSubmissionRepository, AnswerRepository answerRepository, UserFormStatusRepository userFormStatusRepository) {
        this.formRepository = formRepository;
        this.questionMapper = questionMapper;
        this.questionRepository = questionRepository;
        this.formMapper = formMapper;
        this.answerMapper = answerMapper;
        this.appUserRepository = appUserRepository;
        this.answerService = answerService;
        this.formSubmissionRepository = formSubmissionRepository;
        this.answerRepository = answerRepository;
        this.userFormStatusRepository = userFormStatusRepository;
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

    public String sendFormToUsers(Long formId, List<Long> userIds) {
        Form form = formRepository.findById(formId)
                .orElseThrow(() -> new FormNotFoundException("Form not found with that ID"));

        List<AppUser> newUsers = appUserRepository.findAllById(userIds);

        Set<UserFormStatus> newUserFormStatuses = newUsers.stream()
                .map(user -> UserFormStatus.builder()
                        .form(form)
                        .user(user)
                        .status(UserFormStatus.Status.NOT_FILLED)
                        .build())
                .collect(Collectors.toSet());

        userFormStatusRepository.saveAll(newUserFormStatuses);

        return "Form sent successfully to users with IDs: " + userIds;
    }

    public List<Long> getUsersFormIsAssignedTo(Long formId) {
        Form form = formRepository.findById(formId)
                .orElseThrow(() -> new FormNotFoundException("Form not found with that ID"));

        return form.getUserFormStatuses().stream()
                .map(status -> status.getUser().getId())
                .collect(Collectors.toList());
    }


    public List<UserFormStatusDto> getMyForms() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();

        Optional<AppUser> optionalUser = appUserRepository.findByUsername(username);
        if (optionalUser.isPresent()) {
            AppUser user = optionalUser.get();

            List<UserFormStatus> userFormStatuses = userFormStatusRepository.findByUser(user);

            // Map UserFormStatus entities to DTOs with Form details
            List<UserFormStatusDto> userFormStatusDtos = userFormStatuses.stream()
                    .map(userFormStatus -> {
                        Form form = userFormStatus.getForm();
                        return new UserFormStatusDto(
                                userFormStatus.getId(),
                                form.getTitle(),
                                form.getDescription(),
                                form.getQuestions(),
                                form.getQuestions().size(),
                                userFormStatus.getStatus().toString(),
                                userFormStatus.getSubmissionDate()
                                );
                    })
                    .collect(Collectors.toList());

            return userFormStatusDtos;
        }

        return Collections.emptyList();
    }




   public String fillForm(List<AnswerDto> answerDto, Long userFormId)
   {
       Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
       var user = (AppUser) authentication.getPrincipal();
       if (user==null) {
           throw new AppUserNotFoundException("User is not authenticated!");
       }
       UserFormStatus userFormStatus = userFormStatusRepository.findById(userFormId).orElseThrow();
       List<Answer> answers = answerDto.stream()
               .map(answerService::convertToEntity)
               .collect(Collectors.toList());
       userFormStatus.setStatus(UserFormStatus.Status.FILLED);
       userFormStatusRepository.save(userFormStatus);
       FormSubmission formSubmission= FormSubmission.builder()
               .userFormStatus(userFormStatus)
               .answers(answers)
               .user(user)
               .build();
       formSubmissionRepository.save(formSubmission);
      return "Form has been updated";
   }




}
