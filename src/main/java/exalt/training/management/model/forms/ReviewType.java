package exalt.training.management.model.forms;

import java.util.Arrays;

public enum ReviewType {
    // how to easily make new types from enum class
    TRAINING_FEEDBACK,
    SUPERVISOR_REVIEW,
    INTERVIEW_REVIEW,
    EMPLOYEE_REVIEW,
    TRAINER_REVIEW,
    INTERNSHIP_FEEDBACK,
    PROJECT_REVIEW,
    COURSE_REVIEW,
    OTHER_REVIEW;

    public static boolean isValid(String formType) {
        return Arrays.stream(values()).anyMatch(enumValue -> enumValue.name().equalsIgnoreCase(formType));
    }
}
