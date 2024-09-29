## 🛠️ Getting Started


#### 🏃‍♂️ Running the Project
Before running the project, ensure that Docker is installed and running on your machine. The following command will use Docker Compose to handle the backend, frontend, and MySQL:

- `docker-compose up -d`

#### 🚀 open up the project
Once the containers are running, you can open the following URL in your browser to view the frontend of the project:

- http://localhost:3000/


#### 👨‍🔬 swagger api documentation
A health check API has been added to the Swagger documentation for testing purposes. You can access it at:

- http://localhost:8080/api-doc


#### 🏎️ other consideration
Here are some suggestions for additional features that could be implemented in the project:

1. Authentication & Authorization

    User Registration & Login: Implement a secure user authentication system (JWT, OAuth2).
    Role-Based Access Control (RBAC): Add different user roles (admin, user) with different permissions.

2. CI/CD Pipeline

    Automated Testing: Set up tests using tools like Jest or Mocha for backend and frontend.
    Continuous Integration: Use GitHub Actions, CircleCI, or TravisCI to automatically test and deploy your code.

3. GraphQL API

    I can also GraphQL API for flexibility in handling different kinds of API requests.

4. Analytics & Monitoring

    Google Analytics/Hotjar: Integrate basic analytics to track user interactions.
    Error Monitoring: Implement Sentry or a similar service to track errors.

5. Testing & Code Quality

    Unit/Integration Tests: Demonstrate thorough test coverage, especially on critical parts of the app.
    Code Linting & Formatting: Use ESLint and Prettier to enforce consistent code quality.

6. Deployment

    Cloud Deployment: Deploy to a cloud platform like AWS, DigitalOcean, or Heroku, and provide steps to reproduce the environment.

7. Documentation

    Enhencing API documentation by Swagger or Postman


