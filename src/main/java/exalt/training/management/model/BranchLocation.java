package exalt.training.management.model;


import java.util.Arrays;
public enum BranchLocation {
    RAMALLAH, NABLUS, BETHLEHEM, OTHER;

    public static boolean isValid(String location) {
        return Arrays.stream(values()).anyMatch(enumValue -> enumValue.name().equalsIgnoreCase(location));
    }
}
