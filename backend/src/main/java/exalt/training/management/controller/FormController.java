package exalt.training.management.controller;

import exalt.training.management.dto.CompletedFormDto;
import exalt.training.management.dto.FormDataDto;
import exalt.training.management.service.FormService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/forms")
public class FormController {


    private final FormService formService;

    @PostMapping("/completed-form")
    @PreAuthorize("hasAnyRole('TRAINEE','SUPERVISOR','SUPER_ADMIN')")
    @Operation(summary = "Register Form Data" , security =  @SecurityRequirement(name = "loginAuth"))
    public ResponseEntity<String> registerFormData(@RequestBody @Valid CompletedFormDto completedFormDto) {
        return ResponseEntity.ok(formService.registerFormData(completedFormDto));
    }

    @GetMapping("/{formId}")
    @PreAuthorize("hasAnyRole('TRAINEE','SUPERVISOR','SUPER_ADMIN')")
    @Operation(summary = "Register Form Data" , security =  @SecurityRequirement(name = "loginAuth"))
    public ResponseEntity<FormDataDto> getFormDataByFormId(@PathVariable Long formId) {
        return ResponseEntity.ok(formService.getFormDataByFormId(formId));
    }

}
