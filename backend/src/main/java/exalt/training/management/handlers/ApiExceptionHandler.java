package exalt.training.management.handlers;
import exalt.training.management.exception.*;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatusCode;
import org.springframework.validation.FieldError;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.ErrorResponse;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

import java.nio.file.AccessDeniedException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@ControllerAdvice
public class ApiExceptionHandler extends ResponseEntityExceptionHandler {

    @Override
    public ResponseEntity<Object> handleMethodArgumentNotValid (MethodArgumentNotValidException ex,
                                                                HttpHeaders headers,
                                                                HttpStatusCode status,
                                                                WebRequest request) {
        List<String> errors = ex.getBindingResult().getFieldErrors().stream()
                .map(FieldError::getDefaultMessage)
                .collect(Collectors.toList());

        ErrorResponse errorResponse = ErrorResponse.builder(ex, HttpStatus.BAD_REQUEST, "Validation error(s) in request data")
                .detailMessageArguments(errors.toArray())
                .build();

        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
    }
    @ExceptionHandler(InvalidStatusException.class)
    public ResponseEntity<String> handleInvalidStatusException(InvalidStatusException e) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
    }
    @ExceptionHandler(TaskNotFoundException.class)
    public ResponseEntity<String> handleTaskNotFoundException(TaskNotFoundException e) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
    }

    @ExceptionHandler(TrainingPlanNotFoundException.class)
    public ResponseEntity<String> handleTrainingPlanNotFoundException(TrainingPlanNotFoundException e) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
    }
    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<String> handleResourceNotFoundException(ResourceNotFoundException e) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
    }

    @ExceptionHandler(FormSubmissionNotFoundException.class)
    public ResponseEntity<String> handleFormSubmissionNotFoundException(FormSubmissionNotFoundException e) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
    }
    @ExceptionHandler(SkillNotFoundException.class)
    public ResponseEntity<String> handleSkillNotFoundException(SkillNotFoundException e) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
    }

    @ExceptionHandler(TraineeSkillNotFoundException.class)
    public ResponseEntity<String> handleTraineeSkillNotFoundException(TraineeSkillNotFoundException e) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
    }

    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<String> handleAccessDeniedException(AccessDeniedException ex) {
        return new ResponseEntity<>("You can't access this resource.", HttpStatus.FORBIDDEN);
    }
    @ExceptionHandler(AppUserNotFoundException.class)
    public ResponseEntity<String> handleUserNotFoundException(AppUserNotFoundException e) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
    }

    @ExceptionHandler(AcademicGradesNotFoundException.class)
    public ResponseEntity<String> handleAcademicGradesNotFoundException(AcademicGradesNotFoundException e) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
    }

    @ExceptionHandler(InvalidUserException.class)
    public ResponseEntity<String> handleInvalidUserException(InvalidUserException e) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
    }

    @ExceptionHandler(IllegalStateException.class)
    public ResponseEntity<String> handlePasswordException(IllegalStateException e) {
        return ResponseEntity.status(HttpStatus.CONFLICT).body(e.getMessage());
    }

    @ExceptionHandler(UserAlreadyExistsException.class)
    public ResponseEntity<String> handleUserAlreadyExistsException(UserAlreadyExistsException e) {
        return ResponseEntity.status(HttpStatus.CONFLICT).body(e.getMessage());
    }
    @ExceptionHandler(TokenNotFoundException.class)
    public ResponseEntity<String> handleTokenNotFoundException(TokenNotFoundException e) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
    }

    @ExceptionHandler(FormNotFoundException.class)
    public ResponseEntity<String> handleFormNotFoundException(FormNotFoundException e) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
    }

    @ExceptionHandler(InvalidTokenException.class)
    public ResponseEntity<String> handleInvalidTokenException(InvalidTokenException ex) {
        return new ResponseEntity<>(ex.getMessage(), HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(AccountAlreadyActivatedException.class)
    public ResponseEntity<String> handleAccountAlreadyActivatedException(AccountAlreadyActivatedException ex) {
        return new ResponseEntity<>(ex.getMessage(), HttpStatus.CONFLICT);
    }

    @ExceptionHandler(InvalidUserRoleException.class)
    public ResponseEntity<String> handleInvalidUserRoleException(InvalidUserRoleException ex) {
        return new ResponseEntity<>(ex.getMessage(), HttpStatus.CONFLICT);
    }

    @ExceptionHandler(InvalidAcademicCourseException.class)
    public ResponseEntity<String> handleInvalidAcademicCourseException(InvalidAcademicCourseException ex) {
        return new ResponseEntity<>(ex.getMessage(), HttpStatus.CONFLICT);
    }

    @ExceptionHandler(InvalidBranchLocationException.class)
    public ResponseEntity<String> handleInvalidBranchLocationException(InvalidBranchLocationException ex) {
        return new ResponseEntity<>(ex.getMessage(), HttpStatus.CONFLICT);
    }

    @ExceptionHandler(InvalidTrainingFieldException.class)
    public ResponseEntity<String> handleInvalidTrainingFieldException(InvalidTrainingFieldException ex) {
        return new ResponseEntity<>(ex.getMessage(), HttpStatus.CONFLICT);
    }


}