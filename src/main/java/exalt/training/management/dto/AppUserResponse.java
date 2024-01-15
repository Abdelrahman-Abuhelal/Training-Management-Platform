package exalt.training.management.dto;

import exalt.training.management.model.AppUserRole;
import lombok.*;


@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class AppUserResponse {


    private Long userId;

    private String userEmail;

    private AppUserRole userRole;



}