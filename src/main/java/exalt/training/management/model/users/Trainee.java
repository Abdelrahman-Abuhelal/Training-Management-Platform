package exalt.training.management.model.users;

import com.fasterxml.jackson.annotation.*;
import exalt.training.management.model.AcademicGrades;
import exalt.training.management.model.BranchLocation;
import exalt.training.management.model.forms.Form;
import exalt.training.management.model.forms.FormSubmission;
import exalt.training.management.model.users.AppUser;
import exalt.training.management.model.users.Supervisor;
import jakarta.persistence.*;
import lombok.*;
import org.springframework.lang.Nullable;

import java.util.Arrays;
import java.util.List;
import java.util.Set;

@Entity
@Table(name = "trainee")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(exclude = {"academicGrades","supervisors"  ,"user","reviews","reviewSubmissions"})
public class Trainee {


    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String fullNameInArabic;
    private String phoneNumber;
    private String idType;
    private String idNumber;
    @Lob
    private byte[] copyOfId;
    private String city;
    private String address;
    private String universityName;
    private String universityMajor;
    private String expectedGraduationDate;
    private String trainingField;
    @Enumerated(EnumType.STRING)
    private BranchLocation branchLocation;

    @Nullable
    @OneToMany(mappedBy = "trainee",cascade = CascadeType.ALL)
    @JsonIgnore
    @ToString.Exclude
    private Set<AcademicGrades> academicGrades;

    @ManyToMany
    @JsonIgnore
    private List<Supervisor> supervisors;
    @ManyToMany
    @JsonIgnore
    private List<Form> forms;

    @Nullable
    @OneToMany(mappedBy = "trainee", cascade = CascadeType.ALL)
    @JsonIgnore
    private List<FormSubmission> formSubmissions;

    @OneToOne
    @JsonBackReference
    @ToString.Exclude
    private AppUser user;

    @Override
    public String toString() {
        return "Trainee{" +
                "id=" + id +
                ", fullNameInArabic='" + fullNameInArabic + '\'' +
                ", phoneNumber='" + phoneNumber + '\'' +
                ", idType='" + idType + '\'' +
                ", idNumber='" + idNumber + '\'' +
                ", copyOfId=" + Arrays.toString(copyOfId) +
                ", city='" + city + '\'' +
                ", address='" + address + '\'' +
                ", universityName='" + universityName + '\'' +
                ", universityMajor='" + universityMajor + '\'' +
                ", expectedGraduationDate='" + expectedGraduationDate + '\'' +
                ", trainingField='" + trainingField + '\'' +
                ", branchLocation=" + branchLocation +
                '}';
    }
}
