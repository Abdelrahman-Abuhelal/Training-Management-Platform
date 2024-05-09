package exalt.training.management.service;

import exalt.training.management.dto.AppUserDto;
import exalt.training.management.exception.AppUserNotFoundException;
import exalt.training.management.exception.InvalidUserException;
import exalt.training.management.mapper.AppUserMapper;
import exalt.training.management.model.users.AppUser;
import exalt.training.management.model.users.Supervisor;
import exalt.training.management.model.users.Trainee;
import exalt.training.management.repository.AppUserRepository;
import exalt.training.management.repository.SupervisorRepository;
import exalt.training.management.repository.TraineeRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@Slf4j
public class SupervisorService {

    private final SupervisorRepository supervisorRepository;
    private final TraineeRepository traineeRepository;

    private final AppUserMapper appUserMapper;
    private final AppUserRepository appUserRepository;


    public SupervisorService(SupervisorRepository supervisorRepository, TraineeRepository traineeRepository, AppUserMapper appUserMapper, AppUserRepository appUserRepository) {
        this.supervisorRepository = supervisorRepository;
        this.traineeRepository = traineeRepository;
        this.appUserMapper = appUserMapper;
        this.appUserRepository = appUserRepository;
    }


    public void saveSupervisor(Supervisor supervisor){
        supervisorRepository.save(supervisor);
    }

    @Transactional
    public List<AppUserDto> getMyTrainees() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        var user = (AppUser) authentication.getPrincipal();
        var supervisor = user.getSupervisor();
        if (supervisor == null) {
            throw new InvalidUserException("User is not a Supervisor");
        }

        List<Trainee> trainees = traineeRepository.findBySupervisorId(supervisor.getId());

        if (!trainees.isEmpty()) {
            log.info("Supervisor has trainees");
            trainees.size(); // This is a safe operation
        } else {
            log.info("Supervisor doesn't have trainees");
        }
        List <AppUser> appUsers = trainees.stream().map(trainee -> trainee.getUser()).toList();
        return appUserMapper.userToUserDto(appUsers);
    }



    @Transactional
    public List<AppUserDto> getSupervisorTrainees(Long userId) {

        Optional<AppUser> appUser = Optional.ofNullable(appUserRepository.findById(userId).orElseThrow(() -> new AppUserNotFoundException("There is no user with this ID: " + userId)));;
        var supervisor =appUser.get().getSupervisor();
        if(supervisor==null){
            throw new InvalidUserException("There is no such supervisor with this ID");
        }
        List<Trainee> trainees = traineeRepository.findBySupervisorId(supervisor.getId());
        if (!trainees.isEmpty()) {
            log.info("Supervisor has trainees");
            trainees.size(); // This is a safe operation
        } else {
            log.info("Supervisor doesn't have trainees");
        }
        List <AppUser> appUsers = trainees.stream().map(trainee -> trainee.getUser()).toList();
        return appUserMapper.userToUserDto(appUsers);


    }



}
