package exalt.training.management.repository;
import java.util.List;
import java.util.Optional;

import exalt.training.management.model.Token;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface TokenRepository extends JpaRepository<Token, Long> {



    Optional<Token> findByToken(String token);
    @Query(value = """
      select t from Token t inner join AppUser u \s
      on t.user.id = u.id\s
      where u.id = :id and (t.expired = false or t.revoked = false) \s
      """)
    List<Token> findAllValidTokenByUser(Long id);


}