package exalt.training.management.controller;


import exalt.training.management.model.Branch;
import exalt.training.management.service.BranchService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/branches")
@RequiredArgsConstructor
@Slf4j
public class BranchController {

    @Autowired
    private BranchService branchService;

    @GetMapping
    @Operation(summary = "Get All Branches", security =  @SecurityRequirement(name = "loginAuth"))
    @PreAuthorize("hasAnyRole('SUPER_ADMIN')")
    public List<Branch> getAllBranches() {
        return branchService.getAllBranches();
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get Branch By ID", security =  @SecurityRequirement(name = "loginAuth"))
    @PreAuthorize("hasAnyRole('SUPER_ADMIN')")
    public Branch getBranchById(@PathVariable Long id) {
        return branchService.getBranchById(id);
    }

    @PostMapping
    @Operation(summary = "Create Branch By ID", security =  @SecurityRequirement(name = "loginAuth"))
    @PreAuthorize("hasAnyRole('SUPER_ADMIN')")
    public Branch createBranch(@RequestBody Branch branch) {
        return branchService.createBranch(branch);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update Branch By ID", security =  @SecurityRequirement(name = "loginAuth"))
    @PreAuthorize("hasAnyRole('SUPER_ADMIN')")
    public Branch updateBranch(@PathVariable Long id, @RequestBody Branch branchDetails) {
        return branchService.updateBranch(id, branchDetails);
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete Branch By ID", security =  @SecurityRequirement(name = "loginAuth"))
    @PreAuthorize("hasAnyRole('SUPER_ADMIN')")
    public void deleteBranch(@PathVariable Long id) {
        branchService.deleteBranch(id);
    }
}
