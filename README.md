# Training-Management-Platform
It is a Training Management Application designed to streamline and enhance the process of managing training periods for Palestinian students within the company branches during summer or winter breaks.
The primary goal of this application is to provide a centralized platform for HR managers, supervisors, and trainees to efficiently oversee and participate in the training process.


## Security Features
- User registration and login with JWT authentication
- Password encryption using BCrypt
- Role-based authorization with Spring Security
- Complete registration sent email
- Forgot password email and Change password
- Refresh token
- Logout mechanism

# System Features

- Three Portals for three user types: Trainee, Supervisor, SuperAdmin.
- Secure routing mechanism based on roles using ReactJS.
  
## Trainees
- Trainees can register their personal details (Profile).
- Trainees can submit their form answers.
  
## Supervisors
- Supervisors can view their trainees.
- Supervisors can assign tasks to their trainees plan.
- Supervisors can add resources to their trainees plan.
- Supervisors can review the trainees' skills during Internship.
  
## HR managers
- HR managers can view all trainees, all supervisors.
- HR managers can create, edit, and delete trainees profiles.
- HR managers can update their academic grades.
- HR managers can assign trainees to a supervisor.
- HR managers can create any type of review form questions (text, multi-choices, one-choice).
- HR managers can add announcements to trainees and supervisors.
- HR managers can view all reviews done by supervisors and trainees.
  

## Class Diagram
![image](https://github.com/Abdelrahman-Abuhelal/Training-Management-Platform/assets/77440941/5ad7e3d8-f3db-44de-921f-f68f4ce6bc51)


## Backend APIs
### Authentication APIs
![image](https://github.com/Abdelrahman-Abuhelal/Training-Management-Platform/assets/77440941/5422ec0d-2c5d-4366-9d46-f6f708332899)
### User APIs
![image](https://github.com/Abdelrahman-Abuhelal/Training-Management-Platform/assets/77440941/e5b80152-52e1-4496-a735-7072259f7a17)
### Admin APIs
![image](https://github.com/Abdelrahman-Abuhelal/Training-Management-Platform/assets/77440941/95e72d91-75fb-442b-8cd9-9aca485ae565)
### Trainee APIs
![image](https://github.com/Abdelrahman-Abuhelal/Training-Management-Platform/assets/77440941/4d2457ff-5282-464d-b024-e47aa2106c5a)
### Supervisor APIs
![image](https://github.com/Abdelrahman-Abuhelal/Training-Management-Platform/assets/77440941/72e331c5-9ce4-462e-ab8d-d3a03b37db11)
### Review APIs
![image](https://github.com/Abdelrahman-Abuhelal/Training-Management-Platform/assets/77440941/a2438033-9e7c-457f-bc35-af06aed3786d)


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
- intelliJ IDEA 2023
- VSCode


Swagger Documentation: http://yourserver:port/swagger-ui/index.html
