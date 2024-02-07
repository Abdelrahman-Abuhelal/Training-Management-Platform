package exalt.training.management.service;

import exalt.training.management.dto.CompletedFormDto;
import exalt.training.management.dto.RatingDto;
import exalt.training.management.mapper.RatingMapper;
import exalt.training.management.model.AppUser;
import exalt.training.management.model.forms.Form;
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
        var formType=completedFormDto.getType();
        List<Rating> ratings = ratingMapper.ratingDtoToRating(completedFormDto.getRatingsDto());
        // but will this save each rating to which form?
        ratingService.saveRatings(ratings);
        form.setRatings(ratings);
        form.setType(formType);
        form.setDescription(completedFormDto.getDescription());
        formRepository.save(form);

        return "Form registered successfully!";
    }


}
