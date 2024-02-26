package exalt.training.management.repository;


import exalt.training.management.model.Trainee;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;


@Repository
public interface TraineeRepository extends JpaRepository<Trainee, Long> {


}