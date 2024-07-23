package exalt.training.management.config;

import com.fasterxml.jackson.databind.ObjectMapper;
import io.swagger.v3.core.util.Json;
import io.swagger.v3.oas.models.*;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import io.swagger.v3.oas.models.responses.ApiResponse;
import io.swagger.v3.oas.models.responses.ApiResponses;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.io.File;
import java.io.IOException;
import java.util.List;


@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI customizeOpenAPI() {
        OpenAPI openAPI = new OpenAPI()
                .openapi("3.0.0") // Specify the OpenAPI version
                .info(new Info()
                        .title("Training Management System API")
                        .description("")
                        .contact(new Contact()
                                .name("Abdelrahman Abuhelal")
                                .url("https://abdelrahman-abuhelal.netlify.app")
                                .email("abd.hilal14@gmail.com"))
                        .license(new License()
                                .name("Apache 2.0")
                                .url("http://springdoc.org")))
                .components(new Components()
                        .addSecuritySchemes("apiKey", new SecurityScheme()
                                .type(SecurityScheme.Type.APIKEY)
                                .in(SecurityScheme.In.HEADER)
                                .name("api-key")) // Name of the header for the API key
                        .addSecuritySchemes("loginAuth", new SecurityScheme()
                                .type(SecurityScheme.Type.HTTP)
                                .scheme("bearer")
                                .bearerFormat("JWT")
                                .name("login-token"))
                        .addSecuritySchemes("confirmationAuth", new SecurityScheme()
                                .type(SecurityScheme.Type.HTTP)
                                .scheme("bearer")
                                .bearerFormat("JWT")
                                .name("confirmation-token"))
                        .addSecuritySchemes("forgotPasswordAuth", new SecurityScheme()
                                .type(SecurityScheme.Type.HTTP)
                                .scheme("bearer")
                                .bearerFormat("JWT")
                                .name("forgot-password-token")))
                .paths(definePaths());
        return openAPI;
    }
    private Paths definePaths() {
        Paths paths = new Paths();
        paths.put("/api/v1/users/logout",
                new PathItem()
                        .post(new Operation()
                                .summary("Logs out the current user")
                                .description("Invalidates the current session and logs out the user")
                                .tags(List.of("app-user-controller"))
                                .responses(new ApiResponses().addApiResponse("204", new ApiResponse().description("Logout successful")))
                                .security(List.of(new SecurityRequirement().addList("loginAuth")))
                        )
        );
        // Add more paths as needed
        return paths;
    }

    private void writeOpenAPIToFile(OpenAPI openAPI, String filePath) {
        ObjectMapper objectMapper = Json.mapper();
        try {
            objectMapper.writerWithDefaultPrettyPrinter().writeValue(new File(filePath), openAPI);
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

}