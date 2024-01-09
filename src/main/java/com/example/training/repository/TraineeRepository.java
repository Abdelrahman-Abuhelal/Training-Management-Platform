package com.example.training.repository;


import com.example.training.dto.TraineeRegistrationDto;
import com.example.training.model.AppUser;
import com.example.training.model.AppUserRole;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;


// do i need to extend traineeRegistrationDto or what ?
@Repository
public interface TraineeRepository extends JpaRepository<AppUser, Long> {
    Optional <List<AppUser>> findByRole(AppUserRole role);
    Optional <AppUser> findByUsername(String username);

}
