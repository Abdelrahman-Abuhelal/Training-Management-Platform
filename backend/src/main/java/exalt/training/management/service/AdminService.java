package exalt.training.management.service;

import exalt.training.management.dto.*;
import exalt.training.management.exception.*;
import exalt.training.management.mapper.AppUserMapper;
import exalt.training.management.mapper.TraineeMapper;
import exalt.training.management.model.*;
import exalt.training.management.model.users.AppUser;
import exalt.training.management.model.users.AppUserRole;
import exalt.training.management.model.users.Supervisor;
import exalt.training.management.model.users.Trainee;
import exalt.training.management.repository.AcademicGradesRepository;
import exalt.training.management.repository.AppUserRepository;
import exalt.training.management.repository.SupervisorRepository;
import exalt.training.management.repository.TraineeRepository;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import jakarta.transaction.Transactional;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
@Slf4j
public class AdminService {

    private final TraineeRepository traineeRepository;
    private final TraineeService traineeService;
    private final AppUserRepository appUserRepository;
    private final AppUserService appUserService;
    private final TokenService tokenService;
    private final AuthenticationService authenticationService;
    private final EmailService emailService;
    private final AppUserMapper userMapper;

    private final SupervisorRepository supervisorRepository;
    private final TraineeMapper traineeMapper;
    private final BranchService branchService;


    @Autowired
    public AdminService(TraineeRepository traineeRepository,TraineeService traineeService, AppUserRepository appUserRepository, AppUserService appUserService, TokenService tokenService, AuthenticationService authenticationService, EmailService emailService, AppUserMapper userMapper, SupervisorRepository supervisorRepository, TraineeMapper traineeMapper, BranchService branchService) {
        this.traineeRepository = traineeRepository;
        this.traineeService = traineeService;
        this.appUserRepository = appUserRepository;
        this.appUserService = appUserService;
        this.tokenService = tokenService;
        this.authenticationService = authenticationService;
        this.emailService = emailService;
        this.userMapper = userMapper;
        this.supervisorRepository = supervisorRepository;
        this.traineeMapper = traineeMapper;
        this.branchService = branchService;
    }


    public String createUserSecret(UserCreationRequest request) {
        if (appUserService.userAlreadyExists(request.getUserEmail())){
            throw new UserAlreadyExistsException(request.getUserEmail() + " already exists!");
        }
        // add exception when the username is already taken
        if(appUserService.usernameIsNotUnique(request.getUserUsername())){
            throw new UserAlreadyExistsException(request.getUserUsername() + " : this username already reserved before!");
        }
        var user = AppUser.builder()
                .email(request.getUserEmail())
                .firstName(request.getUserFirstName())
                .lastName(request.getUserLastName())
                .username(request.getUserUsername())
                .role(request.getUserRole())
                .userBranch(String.valueOf(branchService.getBranchByBranchName(BranchName.valueOf(request.getUserBranch())).getName()))
                .branch(branchService.getBranchByBranchName(BranchName.valueOf(request.getUserBranch())))
                .activated(false)
                .verified(false)
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


    public void sendCompleteRegistrationEmail(AppUser user, String confirmationToken) {
        try {
            String company_ip= "training.exalt.ps";
            String local="localhost";
            String subject = "[Training Management System] Complete Registration!";
            String htmlContent = "<div style=\"font-family: Arial, sans-serif;\">"
                    + "<h2 style=\"color: #00449e;\">Complete Registration for Exalt Training Application</h2>"
                    + "<p>Dear " + user.getFirstName() +" "+user.getLastName()+ ",</p>"
                    + "<p>To confirm your account in the Exalt Training Application, please click the link below:</p>"
                    + "<p><a href=\"http://"+company_ip+":5173/confirm-account/" + confirmationToken + "\" "
                    + "style=\"background-color: #00449e; color: white; padding: 10px 20px; text-decoration: none; "
                    + "border-radius: 5px;\" target=\"_blank\">Complete Registration</a></p>"
                    + "<p>If you didn't request this, you can ignore this email.</p>"
                    + "<p>Best regards,<br/>"
                    + "Exalt Training System Team</p>"
                    + "</div>";

            MimeMessage mimeMessage = emailService.createMimeMessage(user.getEmail(), subject, htmlContent);
            emailService.sendEmail(mimeMessage);
        } catch (MessagingException e) {
            // Handle exception
            e.printStackTrace();
        }
    }


    public String deactivateUser(Long id){
        if(appUserRepository.findById(id).isEmpty()){
            throw new AppUserNotFoundException("There is no user with this ID: " + id);
        }
        AppUser appUser = getFullUserById(id);
        appUser.setActivated(false);
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
        String username = appUserRequestDto.getUserUsername();
        log.info("Updating user with ID: {} with username: {}", id, username);
        AppUser appUser= getFullUserById(id);
        if(username!=null && !username.equals(appUser.getUsername())){
            if(appUserService.usernameIsNotUnique(username)){
                throw new UserAlreadyExistsException(username + " : this username already reserved before!");
            }
        }
        AppUser appUser1 = userMapper.userRequestDtoToUser(appUserRequestDto,appUser);
        appUser1.setBranch(branchService.getBranchByBranchName(BranchName.valueOf(appUserRequestDto.getUserBranch())));
        appUserRepository.save(appUser1);
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
    public List<AppUserDto> getAllActivatedUsers(){
        List<AppUser>users= appUserService.getAllActivatedUsers();
        if (users.isEmpty()){
            throw new AppUserNotFoundException("There are no activated Users in the System");
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
    public TraineeDataDto getTraineeInfoByUserId(Long id){
        Optional<AppUser> appUserOptional = appUserRepository.findById(id);

        if (appUserOptional.isEmpty()) {
            throw new AppUserNotFoundException("There is no user with this ID: " + id);
        }
        return traineeService.convertToDto(Objects.requireNonNull(appUserOptional.get().getTrainee()));
    }

    public Trainee getTraineeByUserId(Long id){
        Optional<AppUser> appUserOptional = appUserRepository.findById(id);

        if (appUserOptional.isEmpty()) {
            throw new AppUserNotFoundException("There is no user with this ID: " + id);
        }
        return appUserOptional.get().getTrainee();
    }

    public List<TraineeInfoForJobDto> getAllTraineesInfoForJob(){
        List<Trainee> trainees=traineeRepository.findAll();
        if (trainees.isEmpty()){
            String message= "there are no trainees";
            log.info(message);
            throw new AppUserNotFoundException(message);
        }
       List<TraineeInfoForJobDto>traineeInfoForJobDtos=  trainees.stream().map(trainee ->  TraineeInfoForJobDto.builder().userId(trainee.getUser().getId())
                .expectedGraduationDate(trainee.getExpectedGraduationDate())
                .trainingField(trainee.getTrainingField())
                .universityName(trainee.getUniversityName())
                .universityMajor(trainee.getUniversityMajor()).build()).collect(Collectors.toList());
        return traineeInfoForJobDtos;
    }

    public List<TraineeDataDto> getAllTraineesInfo(){
        List<Trainee> trainees=traineeRepository.findAll();
        if (trainees.isEmpty()){
            String message= "there are no trainees";
            log.info(message);
            throw new AppUserNotFoundException(message);
        }
        return traineeService.convertToDtoList(trainees);
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


    public Integer getNumberOfActiveSuperAdmins(){
        List < AppUser> appUsers = appUserRepository.findByRole(AppUserRole.SUPER_ADMIN).orElseThrow(()->new AppUserNotFoundException("No SuperAdmin Users"));
        return Math.toIntExact(appUsers.stream().filter(AppUser::getVerified).count());    }

    public Integer getNumberOfActiveSupervisors(){
        List < AppUser> appUsers = appUserRepository.findByRole(AppUserRole.SUPERVISOR).orElseThrow(()->new AppUserNotFoundException("No Supervisors Users"));
        return Math.toIntExact(appUsers.stream().filter(AppUser::getVerified).count());
    }

    public Integer getNumberOfActiveTrainees(){
        List < AppUser> appUsers = appUserRepository.findByRole(AppUserRole.TRAINEE).orElseThrow(()->new AppUserNotFoundException("No Trainees Users"));
        return Math.toIntExact(appUsers.stream().filter(AppUser::getVerified).count());    }

}