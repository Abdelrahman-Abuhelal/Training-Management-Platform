package exalt.training.management.controller;

import exalt.training.management.dto.FillFormDto;
import exalt.training.management.dto.FormCreationDto;
import exalt.training.management.dto.FormDataDto;
import exalt.training.management.service.FormService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/forms")
public class FormController {


    private final FormService formService;


    @PostMapping( "/create-form")
    @PreAuthorize("hasAnyRole('SUPERVISOR','SUPER_ADMIN')")
    @Operation(summary = "Create Form by Admin" , security =  @SecurityRequirement(name = "loginAuth"))
    public ResponseEntity<String> createForm(@RequestBody @Valid FormCreationDto formCreationDto) {
        return ResponseEntity.ok(formService.createForm(formCreationDto));
    }


    @GetMapping("/{formId}")
    @PreAuthorize("hasAnyRole('TRAINEE','SUPERVISOR','SUPER_ADMIN')")
    @Operation(summary = "Get Form Info By ID" , security =  @SecurityRequirement(name = "loginAuth"))
    public ResponseEntity<FormDataDto> getFormById(@PathVariable Long formId) {
        return ResponseEntity.ok(formService.getFormById(formId));
    }

    @GetMapping()
    @PreAuthorize("hasAnyRole('SUPER_ADMIN')")
    @Operation(summary = "Get All Forms (Admin Only)" , security =  @SecurityRequirement(name = "loginAuth"))
    public ResponseEntity <List<FormDataDto>> getAllForms() {
        return ResponseEntity.ok(formService.getAllForms());
    }


    @PutMapping("/{formId}")
    @PreAuthorize("hasAnyRole('TRAINEE','SUPERVISOR','SUPER_ADMIN')")
    public ResponseEntity <String> fillFormById(@RequestBody FillFormDto fillFormDto, @PathVariable Long formId){
        return ResponseEntity.ok(formService.fillForm(fillFormDto,formId));
    }


/*

    @PostMapping("/completed-form")
    @PreAuthorize("hasAnyRole('TRAINEE','SUPERVISOR','SUPER_ADMIN')")
    @Operation(summary = "Register Form Data" , security =  @SecurityRequirement(name = "loginAuth"))
    public ResponseEntity<String> registerFormData(@RequestBody @Valid CompletedFormDto completedFormDto) {
        return ResponseEntity.ok(formService.registerFormData(completedFormDto));
    }
*/
/*
    @GetMapping("/{formId}")
    @PreAuthorize("hasAnyRole('TRAINEE','SUPERVISOR','SUPER_ADMIN')")
    @Operation(summary = "Get Form Data" , security =  @SecurityRequirement(name = "loginAuth"))
    public ResponseEntity<ReviewDataDto> getFormDataByFormId(@PathVariable Long formId) {
        return ResponseEntity.ok(formService.getFormDataByFormId(formId));
    }*/

}
