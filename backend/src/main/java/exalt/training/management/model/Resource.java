package exalt.training.management.model;


import com.fasterxml.jackson.annotation.JsonBackReference;
import exalt.training.management.model.users.Supervisor;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "resource")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Resource {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "resource_name", nullable = false)
    private String resourceName;

    @Column(name = "description")
    private String description;

    @Column(name = "resource_type", nullable = false)
    private String resourceType;

    @Lob
    @Column(name = "resource_file", columnDefinition = "LONGBLOB")
    private byte[] resourceFile;

    @Column(name = "resource_url")
    private String resourceUrl;

    @ManyToOne
    @JoinColumn(name = "supervisor_id", nullable = false)
    @JsonBackReference
    private Supervisor supervisor;
}
