package exalt.training.management.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import exalt.training.management.model.users.AppUser;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name="token")
public class Token {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private  Long id;

    @Column(unique = true)
    private  String token;

    @Enumerated(EnumType.STRING)
    private  TokenType tokenType;

    private  boolean revoked;

    private  boolean expired;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(nullable = false)
    @JsonBackReference(value = "token-user")
    private AppUser user;
}