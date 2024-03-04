package exalt.training.management.repository;


import exalt.training.management.model.Trainee;
import exalt.training.management.model.forms.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;


@Repository
public interface TraineeRepository extends JpaRepository<Trainee, Long> {

}