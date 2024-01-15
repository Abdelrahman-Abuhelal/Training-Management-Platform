package exalt.training.management.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table
@Data
@Builder
@ToString
@NoArgsConstructor
@AllArgsConstructor
public class Trainee {


    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn()
    private AppUser user;
}
