package com.example.training;

import com.example.training.dto.AppUserResponse;
import com.example.training.dto.RegistrationRequest;
import com.example.training.mapper.AppUserMapper;
import com.example.training.mapper.TraineeMapper;
import com.example.training.model.AppUser;
import com.example.training.repository.TraineeRepository;
import com.example.training.service.TraineeRegistrationService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class TraineeRegistrationServiceTest {

    @Mock
    private TraineeRepository traineeRepository;

    @Mock
    private TraineeMapper traineeMapper;

    @Mock
    private AppUserMapper appUserMapper;

    @InjectMocks
    private TraineeRegistrationService traineeService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testRegisterTrainee() {
        // Given
        RegistrationRequest registrationDto = new RegistrationRequest();
        // Set properties of registrationDto
        registrationDto.setUsername("Abdelrahman");
        registrationDto.setPassword("1241241");
        registrationDto.setUsername("abd.hilal@gmail.com");
        AppUser appUser = new AppUser();
        // Set properties of appUser (based on RegistrationRequest)

        when(traineeMapper.registeredTraineeToUser(registrationDto)).thenReturn(appUser);
        when(traineeRepository.save(any(AppUser.class))).thenReturn(appUser);
        when(appUserMapper.userToUserDto(appUser)).thenReturn(new AppUserResponse());

        // When
        AppUserResponse response = traineeService.registerTrainee(registrationDto);

        // Then
        // Add assertions or verifications based on expected behavior or returned response
        // For example:
        // assertNotNull(response);
        // Verify other interactions or conditions as needed
        verify(traineeMapper, times(1)).registeredTraineeToUser(registrationDto);
        verify(traineeRepository, times(1)).save(appUser);
        verify(appUserMapper, times(1)).userToUserDto(appUser);
    }
}
