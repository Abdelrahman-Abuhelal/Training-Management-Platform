package exalt.training.management.dto;

import exalt.training.management.model.BranchLocation;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;

import java.util.Date;
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class TraineeDataDto {

    private String phoneNumber;
    private String idNumber;
    private String address;
    private String universityName;
    @DateTimeFormat(pattern = "yyyy-MM-dd")
    private Date expectedGraduationDate;
    private String trainingField;
    private BranchLocation branchLocation;
    private AcademicGradesDto academicGradesDto;

}
