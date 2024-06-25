package exalt.training.management.repository;

import exalt.training.management.model.forms.Form;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FormRepository  extends JpaRepository<Form, Long> {

}
