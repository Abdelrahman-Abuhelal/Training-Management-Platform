package exalt.training.management.model;

import java.util.Arrays;

public enum TrainingField {
    BACKEND,FRONTEND, FULLSTACK, MOBILE, QUALITY_ASSURANCE, DESIGN_VERIFICATION,DevOps, OTHER;


    public static boolean isValid(String field) {
        return Arrays.stream(values()).anyMatch(enumValue -> enumValue.name().equalsIgnoreCase(field));
    }

}
