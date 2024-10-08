package exalt.training.management.model.users;

import com.fasterxml.jackson.annotation.*;
import exalt.training.management.model.*;
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
@EqualsAndHashCode(exclude = {"academicGrades","supervisors"  ,"user","traineeSkills","tasks"})
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
    private String trainingYear;
    private String trainingSeason;
    private String startTrainingDate;
    private String endTrainingDate;
    private String bugzillaURL;


    @Nullable
    @OneToMany(mappedBy = "trainee",cascade = CascadeType.ALL)
    @JsonManagedReference
    @ToString.Exclude
    private Set<AcademicGrades> academicGrades;

    @ManyToMany
    @JoinTable(
            name = "trainee_supervisor",
            joinColumns = @JoinColumn(name = "trainee_id"),
            inverseJoinColumns = @JoinColumn(name = "supervisor_id")
    )
    @JsonManagedReference
    private List<Supervisor> supervisors;

    @OneToMany(mappedBy = "trainee", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference
    private Set<TraineeSkill> traineeSkills;

    @OneToMany(mappedBy = "trainee", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference
    private List<TraineeTask> tasks;



    @OneToOne
    @ToString.Exclude
    @JsonBackReference
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
