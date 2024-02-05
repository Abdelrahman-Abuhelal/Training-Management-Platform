package exalt.training.management.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import jakarta.validation.constraints.Size;
import org.springframework.data.annotation.CreatedBy;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedBy;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.lang.Nullable;
import lombok.*;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.time.Instant;
import java.util.Collection;
import java.util.List;

@Entity
@Table(name = "app_user")
@Data
@ToString
@Builder
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode
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
    @OneToOne(mappedBy = "user")
    private Trainee trainee;

    @Nullable
    @JsonManagedReference
    @OneToOne(mappedBy = "user")
    private Supervisor supervisor;

    @Nullable
    @JsonManagedReference
    @OneToOne(mappedBy = "user")
    private SuperAdmin superAdmin;

    @OneToMany(mappedBy = "user")
    @Nullable
    private List<Token> tokens;

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