package exalt.training.management.repository;

import exalt.training.management.model.Comment;
import exalt.training.management.model.users.AppUser;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CommentRepository extends JpaRepository<Comment, Long> {
}
