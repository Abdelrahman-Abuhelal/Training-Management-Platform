package exalt.training.management.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import exalt.training.management.dto.UserCreationRequest;
import exalt.training.management.model.users.AppUserRole;
import exalt.training.management.service.AdminService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.ResultMatcher;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.client.match.MockRestRequestMatchers.content;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@ExtendWith(SpringExtension.class)
@WebMvcTest(AdminController.class)
@AutoConfigureMockMvc  //
public class AdminControllerTests {

    @Autowired
    private MockMvc mockMvc;  // MockMvc for simulating HTTP requests

    @MockBean
    private AdminService adminService;  // Mock the service dependency

    // ... other mocks if needed

    @Test
    public void createUser_ValidRequest_ReturnsOkStatusAndSuccessMessage() throws Exception {
        // Mock adminService behavior
        String expectedResponse = "Complete Account Registration sent to the user email ";
        when(adminService.createUserSecret(any())).thenReturn(expectedResponse);

        // Prepare request data
        UserCreationRequest request = UserCreationRequest.builder().userEmail("valid@gmail.com").userFirstName("asfdsa").userLastName("asdasd")
                .userRole(AppUserRole.TRAINEE).userUsername("dsadasd").build();
        ObjectMapper objectMapper = new ObjectMapper();  // Create an ObjectMapper instance
        String requestBody = objectMapper.writeValueAsString(request);
        // Perform the simulated POST request
        mockMvc.perform(post("/api/v1/admin/create-user").contentType(MediaType.APPLICATION_JSON).content(requestBody)).andExpect(status().isOk());

        verify(adminService).createUserSecret(request);
    }



    @Test
    public void deactivateUser_ValidId_DeactivatesUserAndReturnsOkResponse() throws Exception {
        // Mock adminService behavior
        String expectedResponse = "User with the ID 2 has been deactivated";
        Long userId=2L;
        when(adminService.deactivateUser(userId)).thenReturn(expectedResponse);

        mockMvc.perform(put("/api/v1/admin/users/2/deactivate")).andExpect(status().isOk());
        verify(adminService).deactivateUser(userId);

        mockMvc.perform(put("/api/v1/admin/users/{id}/deactivate", userId))
                .andExpect(status().isOk())
                .andExpect((ResultMatcher) content().string(expectedResponse));


        verify(adminService).deactivateUser(userId);
    }

}
