package exalt.training.management.model.users;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import exalt.training.management.model.*;
import exalt.training.management.model.forms.Form;
import exalt.training.management.model.forms.FormSubmission;
import jakarta.persistence.*;
import jakarta.validation.constraints.Size;
import org.springframework.lang.Nullable;
import lombok.*;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;

@Entity
@Table(name = "app_user")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(exclude = {"trainee", "supervisor", "superAdmin", "tokens","forms"})
public class AppUser implements UserDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable=false, unique=true)
    private String email;

    private String password;

    @Column(unique=true)
    private String username;

    @Enumerated(EnumType.STRING)
    @Column(nullable=false)
    private AppUserRole role;

    @Size(max = 50)
    private String firstName;

    @Size(max = 50)
    private String lastName;

    private String fullName;

    @Size(max = 256)
    @Column(length = 256)
    private String imageUrl;


    @Column(nullable=false)
    private Boolean enabled = false;

    @Nullable
    @JsonManagedReference
    @OneToOne(mappedBy = "user", cascade = CascadeType.ALL)
    private Trainee trainee;

    @Nullable
    @JsonManagedReference
    @OneToOne(mappedBy = "user" , cascade = CascadeType.ALL)
    private Supervisor supervisor;

    @Nullable
    @JsonManagedReference
    @OneToOne(mappedBy = "user", cascade = CascadeType.ALL)
    private SuperAdmin superAdmin;

    @Nullable
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
    @JsonManagedReference
    private List<Token> tokens;

    @Nullable
    @ManyToMany(mappedBy = "usersAssignedTo", cascade = CascadeType.ALL)
    @JsonManagedReference
    private List<Form> forms;


//    @Nullable
//    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
//    private List<FormSubmission> formSubmissions;

    @Override
    public String toString() {
        return "AppUser{" +
                "id=" + id +
                ", email='" + email + '\'' +
                ", password='" + password + '\'' +
                ", username='" + username + '\'' +
                ", role=" + role +
                ", firstName='" + firstName + '\'' +
                ", lastName='" + lastName + '\'' +
                ", fullName='" + fullName + '\'' +
                ", imageUrl='" + imageUrl + '\'' +
                ", enabled=" + enabled +
                '}';
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return  role.getAuthorities();
    }
    @Override
    public String getPassword() {
        return password;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return enabled;
    }
}