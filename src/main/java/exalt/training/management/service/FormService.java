package exalt.training.management.service;

import exalt.training.management.dto.CompletedFormDto;
import exalt.training.management.dto.FormDataDto;
import exalt.training.management.dto.RatingDto;
import exalt.training.management.exception.FormNotFoundException;
import exalt.training.management.exception.InvalidFormType;
import exalt.training.management.exception.InvalidTrainingFieldException;
import exalt.training.management.mapper.RatingMapper;
import exalt.training.management.model.AppUser;
import exalt.training.management.model.TrainingField;
import exalt.training.management.model.forms.Form;
import exalt.training.management.model.forms.FormType;
import exalt.training.management.model.forms.Rating;
import exalt.training.management.repository.FormRepository;
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

    private final RatingMapper ratingMapper;
    private final RatingService ratingService;


    @Autowired
    public FormService(FormRepository formRepository, RatingMapper ratingMapper, RatingService ratingService) {
        this.formRepository = formRepository;
        this.ratingMapper = ratingMapper;
        this.ratingService = ratingService;
    }

    public String registerFormData(CompletedFormDto completedFormDto){
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        var user = (AppUser) authentication.getPrincipal();
        Form form = new Form();
        switch (user.getRole()){
            case TRAINEE:
                form.setTrainee(user.getTrainee());
                break;
            case SUPERVISOR:
                form.setSupervisor(user.getSupervisor());
                break;
            case SUPER_ADMIN:
                form.setSuperAdmin(user.getSuperAdmin());
                break;
        }
        Form savedForm = formRepository.save(form);
        String formType= completedFormDto.getType();
        if (!FormType.isValid(formType)){
            throw new InvalidFormType("Invalid Form Type");
        }
        var description=completedFormDto.getDescription();
        List<Rating> ratings = ratingMapper.ratingDtoListToRatingList(completedFormDto.getRatingsDto());
        ratings.forEach(rating -> rating.setForm(savedForm));
        ratingService.saveRatings(ratings);
        savedForm.setRatings(ratings);
        savedForm.setType(FormType.valueOf(formType));
        savedForm.setDescription(description);
        formRepository.save(savedForm);
        return "Form registered successfully!";
    }

    public FormDataDto getFormDataByFormId(Long formId){
        Form form = formRepository.findById(formId).orElseThrow(()->new FormNotFoundException("Form not found with the provided id"));
        return FormDataDto.builder().ratingsDto(ratingMapper.ratingToRatingDto(form.getRatings())).description(form.getDescription()).type(form.getType()).build();
    }


}
