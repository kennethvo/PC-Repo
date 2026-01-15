# Week 9 - Tuesday: Docker Images and Containers

## 1. Docker Images

### What is a Docker Image?
A **Docker Image** is a lightweight, standalone, executable package that includes everything needed to run a piece of software, including:
-   The code
-   A runtime environment
-   Libraries
-   Environment variables
-   Configuration files

### Image Characteristics
-   **Immutable**: Once created, an image doesn't change. You create new versions.
-   **Layered**: Images are built in layers. Each instruction in a Dockerfile creates a new layer.
-   **Reusable**: Layers are cached and shared between images to save space.

### Base Images vs. Child Images
-   **Base Image**: Has no parent image (e.g., `ubuntu`, `alpine`, `node`).
-   **Child Image**: Built on top of a base image, adding more functionality.

### Image Naming Convention
```
registry/repository:tag
docker.io/library/nginx:latest
└── registry └── repo  └── tag
```
-   **Registry**: Where images are stored (default: Docker Hub).
-   **Repository**: Name of the image.
-   **Tag**: Version identifier (default: `latest`).

---

## 2. Dockerfile

### What is a Dockerfile?
A **Dockerfile** is a text document containing all the commands to assemble an image. It's the blueprint for your container.

### Common Dockerfile Instructions

| Instruction | Purpose | Example |
| :--- | :--- | :--- |
| `FROM` | Sets the base image | `FROM openjdk:17-alpine` |
| `WORKDIR` | Sets the working directory | `WORKDIR /app` |
| `COPY` | Copies files from host to container | `COPY target/app.jar /app/app.jar` |
| `ADD` | Like COPY but can extract archives | `ADD files.tar.gz /app/` |
| `RUN` | Executes commands during image build | `RUN apt-get update && apt-get install -y curl` |
| `CMD` | Default command to run when container starts | `CMD ["java", "-jar", "app.jar"]` |
| `ENTRYPOINT` | Command that always runs (harder to override) | `ENTRYPOINT ["java"]` |
| `ENV` | Sets environment variables | `ENV PORT=8080` |
| `EXPOSE` | Documents which port the container listens on | `EXPOSE 8080` |
| `VOLUME` | Creates a mount point for external storage | `VOLUME /data` |

### Sample Dockerfile for Spring Boot App
```dockerfile
# Use official OpenJDK base image
FROM openjdk:17-alpine

# Set working directory
WORKDIR /app

# Copy the JAR file
COPY target/myapp-0.0.1-SNAPSHOT.jar app.jar

# Expose port
EXPOSE 8080

# Run the application
CMD ["java", "-jar", "app.jar"]
```

### Building an Image
```bash
# Build from Dockerfile in current directory
docker build -t myapp:1.0 .

# -t: tag (name) the image
# . : build context (current directory)
```

---

## 3. Docker Containers

### What is a Container?
A **container** is a running instance of an image. It's a process that has been isolated from the rest of the system.

### Container Lifecycle
1.  **Created**: Container exists but is not running.
2.  **Running**: Container is actively executing.
3.  **Paused**: Processes are temporarily suspended.
4.  **Stopped**: Container has exited but is not removed.
5.  **Removed**: Container is deleted from the system.

---

## 4. Basic Docker CLI Commands

### Image Commands
```bash
# List all images
docker images

# Pull an image from Docker Hub
docker pull nginx:latest

# Remove an image
docker rmi nginx:latest

# Tag an image
docker tag myapp:1.0 myusername/myapp:1.0

# Inspect image details
docker image inspect nginx
```

### Container Commands
```bash
# Run a container (creates and starts)
docker run -d -p 8080:80 --name webserver nginx
# -d: detached mode (background)
# -p: port mapping (host:container)
# --name: give container a name

# List running containers
docker ps

# List all containers (including stopped)
docker ps -a

# Stop a container
docker stop webserver

# Start a stopped container
docker start webserver

# Restart a container
docker restart webserver

# Remove a container
docker rm webserver

# Remove a running container (force)
docker rm -f webserver

# View container logs
docker logs webserver

# Follow logs in real-time
docker logs -f webserver

# Execute command in running container
docker exec -it webserver bash
# -i: interactive
# -t: allocate a pseudo-TTY
```

### Cleanup Commands
```bash
# Remove all stopped containers
docker container prune

# Remove unused images
docker image prune

# Remove all unused data (containers, networks, images, cache)
docker system prune

# Remove everything (including volumes)
docker system prune -a --volumes
```

---

## 5. Docker Registry and Repository

### What is a Docker Registry?
A **registry** is a storage and distribution system for Docker images. It's like GitHub for Docker images.

### Types of Registries
-   **Public Registries**: Docker Hub, Google Container Registry, Amazon ECR.
-   **Private Registries**: Self-hosted registries for internal use.

### Docker Hub
**Docker Hub** is the default public registry. It hosts:
-   Official images (e.g., `nginx`, `postgres`, `redis`).
-   Community images.
-   Your personal/organization repositories.

### Working with Docker Hub
```bash
# Login to Docker Hub
docker login

# Tag image for Docker Hub
docker tag myapp:1.0 myusername/myapp:1.0

# Push image to Docker Hub
docker push myusername/myapp:1.0

# Pull image from Docker Hub
docker pull myusername/myapp:1.0
```

### Repository vs. Registry
-   **Registry**: The service that stores images (e.g., Docker Hub).
-   **Repository**: A collection of related images with the same name but different tags.

Example:
```
docker.io/library/nginx:latest
docker.io/library/nginx:1.21
docker.io/library/nginx:alpine
```
All three are different **tags** in the same **nginx repository** on the **docker.io registry**.

---

## 6. Creating and Deploying a Docker Container

### Step-by-Step: Spring Boot App

#### Step 1: Build the Application
```bash
# Build Spring Boot JAR
mvn clean package
```

#### Step 2: Create Dockerfile
```dockerfile
FROM openjdk:17-alpine
WORKDIR /app
COPY target/myapp-0.0.1-SNAPSHOT.jar app.jar
EXPOSE 8080
CMD ["java", "-jar", "app.jar"]
```

#### Step 3: Build Docker Image
```bash
docker build -t spring-app:1.0 .
```

#### Step 4: Run Container
```bash
docker run -d -p 8080:8080 --name my-spring-app spring-app:1.0
```

#### Step 5: Test the Application
```bash
# Access the app
curl http://localhost:8080

# Check logs
docker logs my-spring-app
```

#### Step 6: Push to Docker Hub
```bash
docker tag spring-app:1.0 myusername/spring-app:1.0
docker push myusername/spring-app:1.0
```

#### Step 7: Deploy on Another Machine
```bash
docker pull myusername/spring-app:1.0
docker run -d -p 8080:8080 myusername/spring-app:1.0
```

---

## 7. Best Practices

### Multi-Stage Builds
Reduce image size by separating build and runtime environments.

```dockerfile
# Stage 1: Build
FROM maven:3.8-openjdk-17 AS build
WORKDIR /app
COPY pom.xml .
COPY src ./src
RUN mvn clean package -DskipTests

# Stage 2: Runtime
FROM openjdk:17-alpine
WORKDIR /app
COPY --from=build /app/target/myapp.jar app.jar
CMD ["java", "-jar", "app.jar"]
```

### Use .dockerignore
Prevent unnecessary files from being copied into the image.

```.dockerignore
target/
*.log
.git
.env
node_modules/
```

### Keep Images Small
-   Use minimal base images (e.g., `alpine`).
-   Combine RUN commands to reduce layers.
-   Remove temporary files in the same layer they're created.
