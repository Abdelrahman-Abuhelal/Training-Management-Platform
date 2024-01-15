package exalt.training.management.model;

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
    private  AppUser user;
}