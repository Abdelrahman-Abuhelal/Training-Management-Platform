package exalt.training.management.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;
import exalt.training.management.model.forms.Review;
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
@EqualsAndHashCode(exclude = {"academicGrades", "reviews","user"})

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
    private Set<AcademicGrades> academicGrades;

    @Nullable
    @ManyToMany(cascade = CascadeType.ALL) // Many-to-Many relationship with Review
    private List <Review> reviews;

    @OneToOne
    @JsonBackReference
    private AppUser user;
}
