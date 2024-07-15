package exalt.training.management.controller;

import exalt.training.management.dto.*;
import exalt.training.management.exception.FormNotFoundException;
import exalt.training.management.model.forms.Form;
import exalt.training.management.service.FormService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/forms")
@Slf4j
public class FormController {


    private final FormService formService;


    @PostMapping( "/create-form")
    @PreAuthorize("hasAnyRole('SUPERVISOR','SUPER_ADMIN')")
    @Operation(summary = "Create Form by Admin" , security =  @SecurityRequirement(name = "loginAuth"))
    public ResponseEntity<String> createFormTemplate(@RequestBody @Valid FormDataDto formDataDto) {
        return ResponseEntity.ok(formService.createForm(formDataDto));
    }

    @DeleteMapping( "/{formId}")
    @PreAuthorize("hasAnyRole('SUPERVISOR','SUPER_ADMIN')")
    @Operation(summary = "Delete Form by Admin" , security =  @SecurityRequirement(name = "loginAuth"))
    public ResponseEntity<String> deleteFormTemplate(@PathVariable Long formId) {
        return ResponseEntity.ok(formService.deleteForm(formId));
    }

    @GetMapping()
    @PreAuthorize("hasAnyRole('SUPER_ADMIN')")
    @Operation(summary = "Get All Forms (Admin Only)" , security =  @SecurityRequirement(name = "loginAuth"))
    public ResponseEntity <List<FormDto>> getAllForms() {
        try {
            return ResponseEntity.ok(formService.getAllForms());
        } catch (Exception e) {
            String errorMessage = "Error retrieving forms: " + e.getMessage();
            // Log the error
            log.error(errorMessage, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);        }
    }

    @GetMapping("/{formId}")
    @PreAuthorize("hasAnyRole('TRAINEE','SUPERVISOR','SUPER_ADMIN')")
    @Operation(summary = "Get Form Info By ID" , security =  @SecurityRequirement(name = "loginAuth"))
    public ResponseEntity<FormCreationDto> getFormById(@PathVariable Long formId) {
        return ResponseEntity.ok(formService.getFormById(formId));
    }
    @PutMapping(value = "/{formId}", consumes = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("hasAnyRole('SUPER_ADMIN')")
    @Operation(summary = "Update Form Info" , security =  @SecurityRequirement(name = "loginAuth"))
    public ResponseEntity<String> updateForm(@PathVariable Long formId, @RequestBody @Valid FormDataDto formDataDto) {
        return ResponseEntity.ok(formService.updateForm(formId,formDataDto));
    }

    @PutMapping(value = "/{formId}/send")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN')")
    @Operation(summary = "Send Form Template to users" , security =  @SecurityRequirement(name = "loginAuth"))
    public ResponseEntity<String> sendFormToUsers(
            @PathVariable Long formId,
            @RequestBody List<Long> userIds
    ) {
        try {
            String result = formService.sendFormToUsers(formId, userIds);
            return ResponseEntity.ok(result);
        } catch (FormNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error sending form: " + e.getMessage());
        }    }

    @GetMapping("/{formId}/users-assigned")
    @PreAuthorize("hasAnyRole('TRAINEE','SUPERVISOR','SUPER_ADMIN')")
    @Operation(summary = "Get Users which The form is assigned to" , security =  @SecurityRequirement(name = "loginAuth"))
    public ResponseEntity<List<Long>> getUsersFormIsAssignedTo(@PathVariable Long formId) {
        return ResponseEntity.ok(formService.getUsersFormIsAssignedTo(formId));
    }

    @PutMapping("/{formId}/submit")
    @PreAuthorize("hasAnyRole('TRAINEE','SUPERVISOR','SUPER_ADMIN')")
    @Operation(summary = "Fill Form with user answers" , security =  @SecurityRequirement(name = "loginAuth"))
    public ResponseEntity <String> fillFormById(@RequestBody List<AnswerDto> answers, @PathVariable Long formId){
        log.info("Received answers: " + answers);
        log.info("Form ID: " + formId);
        return ResponseEntity.ok(formService.fillForm(answers,formId));
    }





//    @Operation(summary = "Find all forms", security =  @SecurityRequirement(name = "loginAuth"))
//    @PutMapping("/users/{userId}")
//    public ResponseEntity<String> getFormsByUserId(@PathVariable Long userId)  {
//        return ResponseEntity.ok(formService.getFormsByUserId(userId));
//    }





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
