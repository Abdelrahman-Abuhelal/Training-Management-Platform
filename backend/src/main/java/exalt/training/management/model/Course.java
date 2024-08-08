package exalt.training.management.model;


import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "courses")
@Data
@ToString
@AllArgsConstructor
@NoArgsConstructor
public class Course {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String name;


}

