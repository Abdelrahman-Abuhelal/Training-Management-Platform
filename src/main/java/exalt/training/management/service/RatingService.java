package exalt.training.management.service;

import exalt.training.management.model.forms.Rating;
import exalt.training.management.repository.RatingRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@Slf4j
public class RatingService {
    private final RatingRepository ratingRepository;

    public RatingService(RatingRepository ratingRepository) {
        this.ratingRepository = ratingRepository;
    }

    public void saveRatings(List<Rating> ratings) {
        ratingRepository.saveAll(ratings);
    }
}
