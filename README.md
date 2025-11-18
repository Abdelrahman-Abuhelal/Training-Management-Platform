# Training-Management-Platform for Internship program
It is a Training Management Application designed to streamline and enhance the process of managing training periods for Palestinian students within the company branches during summer or winter breaks.
The primary goal of this application is to provide a centralized platform for HR managers, supervisors, and trainees to efficiently oversee and participate in the training process.

- Project Timeline : Dec 2023 - March 2024 , June 2024 - September 2024
- Project Duration : +6 months.
- First_Version Deployed at 14/7/2024.

# Video Demo:
https://www.loom.com/share/aa6cf05960cf4d38827b2fcefc7f8700

## Security Features
- User registration and login with JWT authentication
- Password encryption using BCrypt
- Role-based authorization with Spring Security
- Complete registration sent email
- Forgot password email and Change password
- Refresh token
- Logout mechanism

##  System Features
- Three Portals for three user types: Trainee, Supervisor, SuperAdmin.
- Secure routing mechanism based on roles using ReactJS.
  
## Trainees
- Register their personal details (Profile).
- Submit their answers for recieved forms.
- Track their training Tasks.
- View new announcements regarding training.
  
## Supervisors
- Manage and view their trainees.
- Assign tasks to their trainees.
- Add skills for trainees profile.
- View and submit forms.
  
## HR managers
- Manage User accounts (verified, activated). 
- View all trainees, all supervisors and SuperAdmin Users in different branches (Ramallah, Nablus, Bethlehem).
- View /Update trainees profiles and training details.
- View /Update their academic grades.
- Assign trainees to their supervisor.
- View supervisors profile with their related trainees.
- Create any type of form form questions (text, multi-choices, one-choice).
- View form templates, form responses with the answers.
- View Trainee Skills, filter trainees based on skills.
- Add announcements to trainees and supervisors.  

## Class Diagram
![ClassDiagram](https://github.com/user-attachments/assets/4211a6a0-ab86-4b1b-bd9e-47892a9bbae2)


## Backend APIs
### Authentication APIs
![image](https://github.com/Abdelrahman-Abuhelal/Training-Management-Platform/assets/77440941/5422ec0d-2c5d-4366-9d46-f6f708332899)
### User APIs
![image](https://github.com/Abdelrahman-Abuhelal/Training-Management-Platform/assets/77440941/e5b80152-52e1-4496-a735-7072259f7a17)
### Admin APIs
![image](https://github.com/user-attachments/assets/41e34fca-0018-4a38-92db-4f84cfad2d19)
### Trainee APIs
![image](https://github.com/Abdelrahman-Abuhelal/Training-Management-Platform/assets/77440941/4d2457ff-5282-464d-b024-e47aa2106c5a)
### Supervisor APIs
![image](https://github.com/Abdelrahman-Abuhelal/Training-Management-Platform/assets/77440941/72e331c5-9ce4-462e-ab8d-d3a03b37db11)
### Academic Grades APIs
![image](https://github.com/user-attachments/assets/3c66f32f-f304-45e9-ad91-d834653280d0)
### Branch APIs
![image](https://github.com/user-attachments/assets/277ccb20-67eb-485b-862a-0989c0fb7b6c)
### Form APIs
![image](https://github.com/user-attachments/assets/df9a3b1a-7d8b-4491-8cef-da7c225af0ca)
### Skill APIs
![image](https://github.com/user-attachments/assets/af1b09ce-1d98-48bf-86f5-ff74ecf1b760)
### Task APIs
![image](https://github.com/user-attachments/assets/94d75a23-629a-4df4-8015-29f174d13cbf)
### Comments APIs
![image](https://github.com/user-attachments/assets/adf995fb-3206-41e5-b226-f2a2f88aac50)




# Tools Used to build the project: 
- Java JDK v21
- npm 
- Maven v3.9.5
- MySQL v8.2
- Spring Boot v3.1
- Spring Data JPA
- Mockito 
- Postman
- Swagger 
- React with Vite
- Material UI (MUI)
- intelliJ IDEA 2023
- VSCode


