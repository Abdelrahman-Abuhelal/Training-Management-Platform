package exalt.training.management.model;

import com.fasterxml.jackson.annotation.*;
import exalt.training.management.model.forms.Review;
import exalt.training.management.model.forms.ReviewSubmission;
import jakarta.persistence.*;
import lombok.*;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.lang.Nullable;

import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.Set;

@Entity
@Table(name = "trainee")
@Data
@Builder
@ToString
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(exclude = {"academicGrades","user","reviews","reviewSubmissions"})
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
    private Set<AcademicGrades> academicGrades;

    @ManyToMany
    @JsonIgnore
    private List<Review> reviews;

    @Nullable
    @OneToMany(mappedBy = "trainee", cascade = CascadeType.ALL)
    @JsonIgnore
    private List<ReviewSubmission> reviewSubmissions;

    @OneToOne
    @JsonBackReference
    private AppUser user;
}
