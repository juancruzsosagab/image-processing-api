# Image Processing API - Technical Test

## Overview

This project is a REST API for image processing and task management, implemented in Node.js with TypeScript. It follows a clean hexagonal architecture with separation into domain, application, and infrastructure layers.

The API allows clients to:
- Create image processing tasks by submitting an original image path (local or URL).
- Query task status, price, and processed image variants.
- Process images asynchronously, generating resized versions.

---

## Features & Implementation Details

- **Image Processing Delay (Sleep):**  
  To demonstrate the "pending" state on task creation, the image processing service intentionally waits 4 seconds before processing. This delay allows clients to observe a `pending` status immediately after task creation.

- **Hexagonal Architecture:**  
  The project is organized into `domain`, `application`, and `infrastructure` layers, promoting modularity and testability.

- **Testing:**  
  - Unit tests for use cases, services, and repositories.  
  - Integration and end-to-end tests covering API endpoints and full workflows.

- **Postman Collection:**  
  A Postman collection is included to facilitate API testing and exploration. It contains predefined requests for creating tasks and fetching task statuses.

- **Docker Compose Setup:**  
  The project includes a `docker-compose.yml` file to spin up required services easily:  
  - MongoDB database  
  - Mongo Express UI for database management  
  - Seed container that runs initial data loading scripts  

  The seed container executes a script that populates MongoDB with sample data. This happens automatically when you run `docker-compose up`.

---

## Getting Started

### Prerequisites

- Node.js (v18+ recommended)  
- Docker and Docker Compose installed  

### Installation

1. Clone the repository:
```
git clone <repository-url>
cd image-processing-api
```

2. Install dependencies:
```
npm install
```

3. Start Docker containers (MongoDB, Mongo Express, Seed):
```
docker-compose up
```

This will start the database, admin UI, and run the seed script automatically.

4. Run the application (in another terminal):
```
npm run start:dev
```

5. Run tests:
- Unit and integration tests with coverage:
  ```
  npm run test
  ```
- End-to-end tests:
  ```
  npm run test:e2e
  ```

---

## Additional Information

- The image processing includes a 4-second delay to simulate pending state immediately after task creation.
- Mongo Express is available at [http://localhost:8081](http://localhost:8081).
- The seed script loads initial data to MongoDB automatically during docker-compose startup.
- API endpoints are documented and ready for testing (Postman collection included).
- Commits follow Conventional Commits format.
