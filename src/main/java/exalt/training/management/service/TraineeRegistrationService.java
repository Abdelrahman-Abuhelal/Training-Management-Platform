package exalt.training.management.service;


import exalt.training.management.mapper.AppUserMapper;
import exalt.training.management.mapper.TraineeMapper;
import exalt.training.management.repository.TraineeRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j

public class TraineeRegistrationService {

    private final TraineeRepository traineeRepository;

    private final TraineeMapper traineeMapper;

    private final AppUserMapper appUserMapper;







}
