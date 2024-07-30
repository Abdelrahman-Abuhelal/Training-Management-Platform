package exalt.training.management.repository;

import exalt.training.management.model.Branch;
import exalt.training.management.model.BranchName;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface BranchRepository extends JpaRepository<Branch, Long> {

    Optional<Branch> findByName(BranchName branchName);
}
