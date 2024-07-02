package exalt.training.management.service;

import exalt.training.management.dto.*;
import exalt.training.management.exception.*;
import exalt.training.management.mapper.AppUserMapper;
import exalt.training.management.mapper.TraineeMapper;
import exalt.training.management.model.*;
import exalt.training.management.model.users.AppUser;
import exalt.training.management.model.users.Supervisor;
import exalt.training.management.model.users.Trainee;
import exalt.training.management.repository.AcademicGradesRepository;
import exalt.training.management.repository.AppUserRepository;
import exalt.training.management.repository.SupervisorRepository;
import exalt.training.management.repository.TraineeRepository;
import jakarta.transaction.Transactional;
import lombok.extern.slf4j.Slf4j;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
@Slf4j
public class AdminService {

    private final TraineeRepository traineeRepository;
    private final AppUserRepository appUserRepository;
    private final AppUserService appUserService;
    private final TokenService tokenService;
    private final AuthenticationService authenticationService;
    private final EmailService emailService;
    private final AppUserMapper userMapper;
    private final EnumSet<CourseType> validCourseTypes = EnumSet.allOf(CourseType.class);

    private final SupervisorRepository supervisorRepository;
    private final TraineeMapper traineeMapper;
    private final AcademicGradesRepository academicGradesRepository;

    public AdminService(TraineeRepository traineeRepository, AppUserRepository appUserRepository, AppUserService appUserService, TokenService tokenService, AuthenticationService authenticationService, EmailService emailService, AppUserMapper userMapper, SupervisorRepository supervisorRepository, TraineeMapper traineeMapper, AcademicGradesRepository academicGradesRepository) {
        this.traineeRepository = traineeRepository;
        this.appUserRepository = appUserRepository;
        this.appUserService = appUserService;
        this.tokenService = tokenService;
        this.authenticationService = authenticationService;
        this.emailService = emailService;
        this.userMapper = userMapper;
        this.supervisorRepository = supervisorRepository;
        this.traineeMapper = traineeMapper;
        this.academicGradesRepository = academicGradesRepository;
    }


    public String createUserSecret(UserCreationRequest request) {
        if (appUserService.userAlreadyExists(request.getEmail())){
            throw new UserAlreadyExistsException(request.getEmail() + " already exists!");
        }
        // add exception when the username is already taken
        if(appUserService.usernameAlreadyTaken(request.getUsername())){
            throw new UserAlreadyExistsException(request.getUsername() + " : this username already reserved before!");
        }
        var user = AppUser.builder()
                .email(request.getEmail())
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .username(request.getUsername())
                .role(request.getRole())
                .enabled(false)
                .build();
        log.info("User Created: " + user.toString());
        var savedUser = appUserRepository.save(user);
        var jwtConfirmationToken = tokenService.generateConfirmation(user);
        var refreshToken = tokenService.generateRefreshToken(user);
        // Save the token as Confirmation token
        authenticationService.saveUserConfirmationToken(savedUser, jwtConfirmationToken);
        if(tokenService.isTokenValid(jwtConfirmationToken,savedUser)){
            sendCompleteRegistrationEmail(user,jwtConfirmationToken);
        }
        log.info("Account need verification (NOT ACTIVE)");
        // Should better return a json object
        return "Complete Account Registration sent to the user email: " +savedUser.getEmail();
    }


    public void sendCompleteRegistrationEmail(AppUser user,String confirmationToken){
        SimpleMailMessage mailMessage = new SimpleMailMessage();
        mailMessage.setTo(user.getEmail());
        mailMessage.setSubject("[Training Management System] Complete Registration!");
        mailMessage.setText("To confirm your account in the Exalt Training Application, please complete registration here : "
                +"http://localhost:5173/confirm-account/"+confirmationToken);
        emailService.sendEmail(mailMessage);
    }

    public String deactivateUser(Long id){
        if(appUserRepository.findById(id).isEmpty()){
            throw new AppUserNotFoundException("There is no user with this ID: " + id);
        }
        AppUser appUser = getFullUserById(id);
        appUser.setEnabled(false);
        appUserService.saveUser(appUser);

        return "User with the ID: "+id+" has been deactivated";
    }

    public String deleteUser(Long id){
        if(appUserRepository.findById(id).isEmpty()){
            throw new AppUserNotFoundException("There is no user with this ID: " + id);
        }
        appUserRepository.deleteById(id);
        return "User with the ID: "+id+" has been deleted";
    }


    public AppUserDto getUserById(Long id){
        AppUser appUser= appUserRepository.findById(id).orElseThrow(()-> new AppUserNotFoundException("There is no user with this ID: "+ id));
        return userMapper.userToUserDto(appUser);
    }

    public String updateUserById(Long id, AppUserRequestDto appUserRequestDto){
        AppUser appUser= getFullUserById(id);
        appUserRepository.save(userMapper.userRequestDtoToUser(appUserRequestDto,appUser));
        return "User with ID : " + appUser.getId() +" have been updated";
    }

    public String updateTraineeData(TraineeDataDto traineeDataDTO, Long userId)  {
        Trainee trainee= getTraineeByUserId(userId);
        String trainingField = traineeDataDTO.getTrainingField();
        if ( !TrainingField.isValid(trainingField) && !Objects.equals(trainingField.trim(), "")){
            throw new InvalidTrainingFieldException("Invalid Training Field");
        }
        String branchLocation = traineeDataDTO.getBranchLocation();
        if ( !BranchLocation.isValid(branchLocation) && !Objects.equals(branchLocation.trim(), "")){
            throw new InvalidBranchLocationException("Invalid Branch Location");
        }
        log.info("Received TraineeDataDto: {}", traineeDataDTO);
        Trainee traineeUpdated = traineeMapper.traineeDataDtoToTrainee(traineeDataDTO,trainee);
        traineeRepository.save(traineeUpdated);
        return "Trainee Data Registered Successfully";
    }


    @Transactional
    public void assignSupervisorsToTrainees(List<Long> supervisorUserIds, List<Long> traineeUserIds) {
        List<Supervisor> supervisors = supervisorRepository.findAllById(supervisorRepository.findSupervisorIdsByUserIds(supervisorUserIds));
        List<Trainee> trainees = traineeRepository.findAllById(traineeRepository.findTraineeIdsByUserIds(traineeUserIds));

        log.info("Supervisors : "+supervisors+"; Trainees :  "+ trainees);

        // Assign supervisors to trainees
        for (Trainee trainee : trainees) {
            trainee.setSupervisors(supervisors);
            log.info("ID OF TRAINEE : "+trainee.getId()+" Supervisors "+ trainee.getSupervisors());
        }

        traineeRepository.saveAll(trainees);
    }


    public List<Long> getSupervisorsUserIdsByTraineeUserId(Long traineeUserId) {
        Optional<Trainee> traineeOpt = traineeRepository.findTraineeByUserId(traineeUserId);
        if (!traineeOpt.isPresent()) {
            throw new AppUserNotFoundException("Trainee not found with ID: " + traineeUserId);
        }
        Trainee trainee=traineeOpt.get();
        List<Supervisor> hisSupervisors=trainee.getSupervisors().stream().toList();
        List<Long> supervisorIds = hisSupervisors.stream()
                .map(Supervisor::getId)
                .collect(Collectors.toList());
        //  Return UserIDs for the supervisors
        return appUserRepository.findUserIdsBySupervisorIds(supervisorIds);
    }

    @Transactional
    public String saveAcademicGradesToTrainee(Map<String, Double> grades, Long userId) {
        AppUser appUser = appUserRepository.findById(userId).orElseThrow(()-> new AppUserNotFoundException("There is no user with this ID: "+ userId));
        Trainee trainee = appUser.getTrainee();
        if (trainee == null) {
            throw new AppUserNotFoundException("User is not a Trainee");
        }
        log.info("grades size: {}",grades.size());
        // Uppercase the keys before validation
        Set<String> uppercaseKeys = grades.keySet().stream().map(String::toUpperCase).collect(Collectors.toSet());
        try {
            if (!uppercaseKeys.stream().allMatch(key -> validCourseTypes.contains(CourseType.valueOf(key)))) {
                throw new InvalidAcademicCourseException("Invalid course types found in academicGradesDto");
            }
        }catch (IllegalArgumentException e){
            throw new InvalidAcademicCourseException("Invalid course type found in academicGradesDto");
        }
        academicGradesRepository.deleteAllByTrainee_Id(trainee.getId());
        Set <AcademicGrades> academicGradesSet = new HashSet<>();
        for (Map.Entry<String, Double> entry : grades.entrySet()) {
            String key = entry.getKey();
            Double mark = entry.getValue();
            try {
                // Check for existing grade with the same courseType and trainee
                CourseType courseType = CourseType.valueOf(key.toUpperCase());

                Optional<AcademicGrades> existingGrade = academicGradesRepository.findAcademicGradesByTypeAndTrainee_Id(courseType, trainee.getId());

                if (existingGrade.isPresent()) {
                    existingGrade.get().setMark(mark);
                    academicGradesSet.add(existingGrade.get());
                } else {
                    // Create new grade
                    AcademicGrades newGrade = new AcademicGrades(courseType, mark, trainee);
                    academicGradesSet.add(newGrade);
                }
            } catch (InvalidAcademicCourseException e) {
                throw new InvalidAcademicCourseException("Invalid Course type : " + key);
            }
            }
        academicGradesRepository.saveAll(academicGradesSet);
        trainee.setAcademicGrades(academicGradesSet);
        return "Academic Grades Registered Successfully";
    }

    public List<AcademicGrades> getAcademicGradesForTrainee(Long userId) {
        AppUser appUser = appUserRepository.findById(userId).orElseThrow(()-> new AppUserNotFoundException("There is no user with this ID: "+ userId));
        Trainee trainee = appUser.getTrainee();
        if (trainee == null) {
            throw new AppUserNotFoundException("User is not a Trainee");
        }
        return academicGradesRepository.findByTraineeId(trainee.getId()).orElseThrow(()-> new AcademicGradesNotFoundException("There are no academic grades for this trainee"));

    }

    public AppUser getFullUserById(Long id){
        return appUserRepository.findById(id).orElseThrow(()-> new AppUserNotFoundException("There is no user with this ID: "+ id));
    }
    public List<AppUserDto> getAllUsers(){
        List<AppUser>users= appUserRepository.findAll();
        if (users.isEmpty()){
            throw new AppUserNotFoundException("There are no Users in the System");
        }
        return userMapper.userToUserDto(users);
    }
    public List<AppUserDto> getAllEnabledUsers(){
        List<AppUser>users= appUserService.getAllEnabledUsers();
        if (users.isEmpty()){
            throw new AppUserNotFoundException("There are no enabled Users in the System");
        }
        return userMapper.userToUserDto(users);
    }

    public Trainee getTraineeById(Long id){
        Optional<Trainee> trainee=traineeRepository.findById(id);
        if (trainee.isEmpty()){
            String message=String.format("the trainee with the id %s  is not found",id);
            log.info(message);
            throw new AppUserNotFoundException(message);
        }
        return trainee.get();
    }
    public Trainee getTraineeByUserId(Long id){
        Optional<AppUser> appUserOptional = appUserRepository.findById(id);

        if (appUserOptional.isEmpty()) {
            throw new AppUserNotFoundException("There is no user with this ID: " + id);
        }
        return getTraineeById(Objects.requireNonNull(appUserOptional.get().getTrainee()).getId());
    }


    public List<Trainee> getAllTrainees(){
        List<Trainee> trainees=traineeRepository.findAll();
        if (trainees.isEmpty()){
            String message= "there are no trainees";
            log.info(message);
            throw new AppUserNotFoundException(message);
        }
        return trainees;
    }

    public List<Supervisor> getAllSupervisors(){
        List<Supervisor> supervisors=supervisorRepository.findAll();
        if (supervisors.isEmpty()){
            String message= "there are no supervisors";
            log.info(message);
            throw new AppUserNotFoundException(message);
        }
        return supervisors;
    }

/*    public void deleteTraineeByUsername(String username){
        Optional<AppUser> appUser = traineeRepository.findByEmail(username);
        if (appUser.isEmpty()){
            String message=String.format("the trainee with the username %s  is not found",username);
            log.info(message);
            throw new AppUserNotFoundException(message);
        }
        traineeRepository.delete(appUser.get());
        String message=String.format("the trainee with the username %s  is deleted",username);
        log.info(message);
    }*/

}