package exalt.training.management.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.*;
import org.springframework.lang.Nullable;

import java.util.Date;
import java.util.List;
import java.util.Map;

@Entity
@Table(name = "trainee")
@Data
@Builder
@ToString
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode
public class Trainee {


    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String phoneNumber;
    private String idNumber;
    @Lob
    private byte[] copyOfId;
    private String address;
    private String universityName;
    private String universityMajor;
    private Date expectedGraduationDate;
    private String trainingField;
    @Enumerated(EnumType.STRING)
    private BranchLocation branchLocation;

    @Nullable
    @JsonManagedReference
    @OneToMany(mappedBy = "trainee",cascade = CascadeType.ALL)
    private List<AcademicGrades> academicGrades;

    @OneToOne
    @JsonBackReference
    private AppUser user;
}
