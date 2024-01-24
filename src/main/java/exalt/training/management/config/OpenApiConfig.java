package exalt.training.management.config;

import io.swagger.v3.oas.models.*;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.responses.ApiResponse;
import io.swagger.v3.oas.models.responses.ApiResponses;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;


@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI customizeOpenAPI() {
        return new OpenAPI()
                .components(new Components()
                        .addSecuritySchemes("apiKey", new SecurityScheme()
                                .type(SecurityScheme.Type.APIKEY)
                                .in(SecurityScheme.In.HEADER)
                                .name("api-key") // Name of the header for the API key
                        )
                        .addSecuritySchemes("loginAuth", new SecurityScheme()
                                .type(SecurityScheme.Type.HTTP)
                                .scheme("bearer")
                                .bearerFormat("JWT")
                                .name("login-token")
                        )
                        .addSecuritySchemes("confirmationAuth", new SecurityScheme()
                                .type(SecurityScheme.Type.HTTP)
                                .scheme("bearer")
                                .bearerFormat("JWT")
                                .name("confirmation-token")
                        )
                        .addSecuritySchemes("forgotPasswordAuth", new SecurityScheme()
                                .type(SecurityScheme.Type.HTTP)
                                .scheme("bearer")
                                .bearerFormat("JWT")
                                .name("forgot-password-token")
                        )
                ).paths(definePaths());
        // ...
    }


    private Paths definePaths() {
        Paths paths = new Paths();
        paths.put("/api/v1/auth/logout",
                new PathItem()
                        .post(new Operation()
                                .summary("Logs out the current user")
                                .description("Invalidates the current session and logs out the user")
                                .tags(List.of("authentication-controller"))
                                .responses(new ApiResponses().addApiResponse("204", new ApiResponse().description("Logout successful")))
                                .security(List.of(new SecurityRequirement().addList("loginAuth")))
                        )
        );
        // Add more paths as needed
        return paths;
    }


}