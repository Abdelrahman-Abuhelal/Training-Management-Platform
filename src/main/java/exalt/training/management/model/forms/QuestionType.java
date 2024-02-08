package exalt.training.management.model.forms;

import java.util.Arrays;

public enum QuestionType {
    
    ATTENDANCE,
    TECHNICAL_SKILLS,
    SOFT_SKILLS,
    GENERAL;

    public static boolean isValid(String questionType) {
        return Arrays.stream(values()).anyMatch(enumValue -> enumValue.name().equalsIgnoreCase(questionType));
    }
}
