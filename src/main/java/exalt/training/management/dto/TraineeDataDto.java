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

    private String phoneNumber;
    private String idNumber;
    private String address;
    private String universityName;
    private String universityMajor;
    @DateTimeFormat(pattern = "yyyy-MM-dd")
    private Date expectedGraduationDate;
    private String trainingField;
    private String branchLocation;
//    private Map<String, Double> academicGradesDto;

}
