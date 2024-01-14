package com.example.training.repository;

import com.example.training.model.AppUser;
import com.example.training.model.AppUserRole;
import com.example.training.model.Token;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AppUserRepository extends JpaRepository<AppUser, Long> {
    Boolean existsByUsername(String username);
    Optional<AppUser> findByEmail(String email);

    Optional <List<AppUser>> findByRole(AppUserRole role);

    @Query(value = """
      select t from Token t inner join AppUser u \s
      on t.user.id = u.id\s
      where u.id = :id and (t.expired = false or t.revoked = false) \s
      """)
    List<Token> findAllValidTokenByUser(Long id);

}
