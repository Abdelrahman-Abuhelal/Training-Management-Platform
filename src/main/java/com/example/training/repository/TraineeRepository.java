package com.example.training.repository;


import com.example.training.dto.TraineeRegistrationDto;
import com.example.training.model.AppUser;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;


// do i need to extend traineeRegistrationDto or what ?
@Repository
public interface TraineeRepository extends JpaRepository<AppUser, Long> {
}
