package exalt.training.management.dto;

import exalt.training.management.model.BranchLocation;
import exalt.training.management.model.CourseType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;

import java.util.Date;
import java.util.Map;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class TraineeDataDto {
    private Long userId;
    private String fullNameInArabic;
    private String phoneNumber;
    private String idType;
    private String idNumber;
    private String city;
    private String address;
    private String universityName;
    private String universityMajor;
    private String expectedGraduationDate;
    private String trainingField;
    private String branchLocation;
    private String trainingYear;
    private String trainingSeason;
    private String startTrainingDate;
    private String endTrainingDate;
    private String bugzillaURL;

//    private Map<String, Double> academicGradesDto;

}
