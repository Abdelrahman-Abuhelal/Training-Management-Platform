package exalt.training.management.service;


import exalt.training.management.model.Branch;
import exalt.training.management.model.BranchName;
import exalt.training.management.repository.BranchRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@Slf4j
public class BranchService {

    @Autowired
    private BranchRepository branchRepository;

    public List<Branch> getAllBranches() {
        return branchRepository.findAll();
    }

    public Branch getBranchById(Long id) {
        return branchRepository.findById(id).orElse(null);
    }

    public Branch getBranchByBranchName(BranchName branchName) {
        return branchRepository.findByName(branchName).orElse(null);
    }

    public Branch createBranch(Branch branch) {
        return branchRepository.save(branch);
    }

    public Branch updateBranch(Long id, Branch branchDetails) {
        Branch branch = branchRepository.findById(id).orElse(null);
        if (branch != null) {
            branch.setName(branchDetails.getName());
            return branchRepository.save(branch);
        }
        return null;
    }

    public void deleteBranch(Long id) {
        branchRepository.deleteById(id);
    }
}
