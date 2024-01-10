package com.example.training.repository;

import com.example.training.model.AppUser;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface AppUserRepository extends JpaRepository<AppUser, Long> {
    Boolean existsByUsername(String username);
    Optional<AppUser> findByUsername(String username);

}
