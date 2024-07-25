package exalt.training.management.service;

import exalt.training.management.dto.SkillProficiencyDTO;
import exalt.training.management.dto.TraineeSkillDTO;
import exalt.training.management.dto.TraineeSkillsResponseDTO;
import exalt.training.management.exception.AppUserNotFoundException;
import exalt.training.management.exception.InvalidUserException;
import exalt.training.management.exception.SkillNotFoundException;
import exalt.training.management.exception.TraineeSkillNotFoundException;
import exalt.training.management.model.Skill;
import exalt.training.management.model.TraineeSkill;
import exalt.training.management.model.users.AppUser;
import exalt.training.management.model.users.Trainee;
import exalt.training.management.repository.AppUserRepository;
import exalt.training.management.repository.SkillRepository;
import exalt.training.management.repository.SupervisorRepository;
import exalt.training.management.repository.TraineeSkillRepository;
import jakarta.transaction.Transactional;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

@Service
public class TraineeSkillService {


    private final TraineeSkillRepository traineeSkillRepository;
    private final AppUserRepository appUserRepository;
    private final SkillRepository skillRepository;
    private final SupervisorRepository supervisorRepository;

    public TraineeSkillService(TraineeSkillRepository traineeSkillRepository, AppUserRepository appUserRepository, SkillRepository skillRepository, SupervisorRepository supervisorRepository) {
        this.traineeSkillRepository = traineeSkillRepository;
        this.appUserRepository = appUserRepository;
        this.skillRepository = skillRepository;
        this.supervisorRepository = supervisorRepository;
    }

//    public List<SkillProficiencyDTO> getTraineeSkills(Long userId) {
//        AppUser appUser = appUserRepository.findById(userId).orElseThrow(() -> new AppUserNotFoundException("User not found"));
//        Trainee trainee = appUser.getTrainee();
//
//
//
//        return traineeSkillRepository.findByTrainee(trainee).stream()
//                .map(traineeSkill -> new SkillProficiencyDTO(
//                        traineeSkill.getSkill().getId(),
//                        traineeSkill.getProficiencyLevel().name(),
//                        traineeSkill.getSkill().getTopic().name()
//                ))
//                .collect(Collectors.toList());
//    }

    @Transactional
    public String saveTraineeSkills(TraineeSkillDTO traineeSkillDTO, Long userId) {
            AppUser appUser = appUserRepository.findById(userId).orElseThrow(()->new AppUserNotFoundException("User not found"));
            if(appUser.getTrainee()==null){
                throw new AppUserNotFoundException("User not found!!");
            }
            Trainee trainee=appUser.getTrainee();
            traineeSkillRepository.deleteByTrainee(trainee);

            List<TraineeSkill> traineeSkills = traineeSkillDTO.getSkills().stream()
                    .map(dto -> {
                        Skill skill = skillRepository.findById(dto.getSkillId()).orElseThrow(()-> new SkillNotFoundException("skill not found"));
                        TraineeSkill traineeSkill = new TraineeSkill();
                        traineeSkill.setTrainee(trainee); // Assuming you have a way to get the Trainee entity
                        traineeSkill.setSkill(skill); // Assuming you have a way to get the Skill entity
                        traineeSkill.setProficiencyLevel(TraineeSkill.ProficiencyLevel.valueOf(dto.getProficiencyLevel()));
                        return traineeSkill;
                    })
                    .collect(Collectors.toList());

            traineeSkillRepository.saveAll(traineeSkills);
        return "Trainee Skills have been saved";
    }


    @Transactional
    public String deleteTraineeSkill(Long userId, Long skillId) {
        AppUser appUser = appUserRepository.findById(userId).orElseThrow(() -> new AppUserNotFoundException("User not found"));
        if (appUser.getTrainee() == null) {
            throw new AppUserNotFoundException("User not found!!");
        }
        Trainee trainee = appUser.getTrainee();
        TraineeSkill traineeSkill = traineeSkillRepository.findByTraineeAndSkillId(trainee, skillId)
                .orElseThrow(() -> new TraineeSkillNotFoundException("Trainee skill not found"));
        traineeSkillRepository.delete(traineeSkill);
        return "Trainee Skill has been deleted";
    }


    public TraineeSkillsResponseDTO viewTraineeSkills(Long userId) {
        AppUser appUser = appUserRepository.findById(userId).orElseThrow(() -> new AppUserNotFoundException("User not found"));
        if (appUser.getTrainee() == null) {
            throw new AppUserNotFoundException("User not found!!");
        }
        String name = appUser.getFirstName()+ " " + appUser.getLastName();
        List<TraineeSkill> traineeSkills = traineeSkillRepository.findByTrainee(appUser.getTrainee());

        List<SkillProficiencyDTO> skills = traineeSkills.stream()
                .map(ts -> new SkillProficiencyDTO(ts.getSkill().getId(),ts.getSkill().getName(), ts.getProficiencyLevel().name(), ts.getSkill().getTopic().toString()))
                .collect(Collectors.toList());

        return new TraineeSkillsResponseDTO(userId,name, skills);
    }


    public List<TraineeSkillsResponseDTO> getAllTraineesWithSkills() {
        List<AppUser> enabledUsers  = appUserRepository.findByEnabledTrue();
        List<Trainee> trainees = enabledUsers.stream().map(AppUser::getTrainee).filter(Objects::nonNull).toList();
        return trainees.stream().map(trainee -> {
            List<TraineeSkill> traineeSkills = traineeSkillRepository.findByTrainee(trainee);
            List<SkillProficiencyDTO> skills = traineeSkills.stream()
                    .map(ts -> new SkillProficiencyDTO(ts.getSkill().getId(), ts.getSkill().getName(), ts.getProficiencyLevel().name(), ts.getSkill().getTopic().toString()))
                    .collect(Collectors.toList());
            String name= trainee.getUser().getFirstName()+" "+ trainee.getUser().getLastName();
            Long id=trainee.getUser().getId();
            return new TraineeSkillsResponseDTO(id,name, skills);
        }).collect(Collectors.toList());
    }

    @Transactional
    public List<TraineeSkillsResponseDTO> getMyTraineesSkills() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        var user = (AppUser) authentication.getPrincipal();
        var supervisor = supervisorRepository.findByIdWithTrainees(user.getSupervisor().getId());

        if (supervisor == null) {
            throw new InvalidUserException("User is not a Supervisor");
        }

        List<Trainee> trainees = supervisor.getTrainees().stream()
                .filter(trainee -> appUserRepository.findByEnabledTrueAndId(trainee.getUser().getId()).isPresent())
                .toList();

        return trainees.stream().map(trainee -> {
            List<TraineeSkill> traineeSkills = traineeSkillRepository.findByTrainee(trainee);
            List<SkillProficiencyDTO> skills = traineeSkills.stream()
                    .map(ts -> new SkillProficiencyDTO(ts.getSkill().getId(), ts.getSkill().getName(), ts.getProficiencyLevel().name(), ts.getSkill().getTopic().toString()))
                    .collect(Collectors.toList());
            String name = trainee.getUser().getFirstName() + " " + trainee.getUser().getLastName();
            Long id = trainee.getUser().getId();
            return new TraineeSkillsResponseDTO(id, name, skills);
        }).collect(Collectors.toList());
    }

}
