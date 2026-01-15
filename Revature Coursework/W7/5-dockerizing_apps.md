# Week 8 - Friday: Dockerizing Spring Boot Applications

## 1. Creating a Dockerfile

### What is a Dockerfile?

A **Dockerfile** is a text file containing a series of instructions that Docker uses to build an image automatically.

### Dockerfile Anatomy

```dockerfile
# Comment
INSTRUCTION arguments
```

### Common Dockerfile Instructions

| Instruction | Purpose | Example |
| :--- | :--- | :--- |
| `FROM` | Set base image | `FROM openjdk:17-jdk-alpine` |
| `WORKDIR` | Set working directory | `WORKDIR /app` |
| `COPY` | Copy files from host to container | `COPY target/*.jar app.jar` |
| `ADD` | Like COPY but can extract archives | `ADD myapp.tar.gz /app` |
| `RUN` | Execute command during build | `RUN apt-get update && apt-get install -y curl` |
| `CMD` | Default command when container starts | `CMD ["java", "-jar", "app.jar"]` |
| `ENTRYPOINT` | Configure container executable | `ENTRYPOINT ["java", "-jar", "app.jar"]` |
| `EXPOSE` | Document which port app listens on | `EXPOSE 8080` |
| `ENV` | Set environment variable | `ENV SPRING_PROFILES_ACTIVE=prod` |
| `ARG` | Build-time variable | `ARG JAR_FILE=target/*.jar` |
| `LABEL` | Add metadata | `LABEL maintainer="dev@example.com"` |
| `USER` | Set user for RUN/CMD/ENTRYPOINT | `USER appuser` |
| `VOLUME` | Create mount point | `VOLUME /data` |

---

## 2. Dockerizing a Spring Boot Application

### Project Structure

```
my-spring-boot-app/
├── src/
│   ├── main/
│   │   ├── java/
│   │   └── resources/
│   └── test/
├── target/
│   └── my-spring-boot-app-1.0.0.jar
├── pom.xml
├── Dockerfile
└── .dockerignore
```

### Simple Dockerfile

```dockerfile
# Base image with JDK
FROM openjdk:17-jdk-alpine

# Set working directory
WORKDIR /app

# Copy the JAR file
COPY target/my-spring-boot-app-1.0.0.jar app.jar

# Expose port
EXPOSE 8080

# Run the application
ENTRYPOINT ["java", "-jar", "app.jar"]
```

### Building the Image

```bash
# Build image
docker build -t my-spring-boot-app:1.0.0 .

# Run container
docker run -p 8080:8080 my-spring-boot-app:1.0.0
```

---

## 3. Multi-Stage Dockerfile

**Problem**: Including build tools (Maven, Gradle) in the final image makes it unnecessarily large.

**Solution**: Multi-stage builds – build in one stage, run in another.

### Multi-Stage Dockerfile for Maven

```dockerfile
# ==================== Stage 1: Build ====================
FROM maven:3.9-amazoncorretto-17 AS build

# Set working directory
WORKDIR /app

# Copy pom.xml and download dependencies (cached layer)
COPY pom.xml .
RUN mvn dependency:go-offline

# Copy source code
COPY src ./src

# Build the application
RUN mvn clean package -DskipTests

# ==================== Stage 2: Run ====================
FROM amazoncorretto:17-alpine

# Set working directory
WORKDIR /app

# Copy JAR from build stage
COPY --from=build /app/target/*.jar app.jar

# Create non-root user
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser

# Expose port
EXPOSE 8080

# Run application
ENTRYPOINT ["java", "-jar", "app.jar"]
```

### Multi-Stage Dockerfile for Gradle

```dockerfile
# ==================== Stage 1: Build ====================
FROM gradle:8.5-jdk17 AS build

# Set working directory
WORKDIR /app

# Copy Gradle wrapper and dependencies
COPY build.gradle settings.gradle gradlew ./
COPY gradle ./gradle

# Download dependencies (cached layer)
RUN ./gradlew dependencies --no-daemon

# Copy source
COPY src ./src

# Build
RUN ./gradlew bootJar --no-daemon

# ==================== Stage 2: Run ====================
FROM amazoncorretto:17-alpine

WORKDIR /app

# Copy JAR from build stage
COPY --from=build /app/build/libs/*.jar app.jar

# Non-root user
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]
```

### Size Comparison

```
Single-stage (with Maven): 850 MB
Multi-stage (runtime only):  250 MB
```

---

## 4. Optimizing Dockerfile

### 1. Layer Caching

**Bad** (Invalidates cache on any code change):
```dockerfile
FROM openjdk:17-jdk-alpine
WORKDIR /app
COPY . .  # Copies everything, including frequently changing source code
RUN mvn package
```

**Good** (Maximizes cache reuse):
```dockerfile
FROM maven:3.9-jdk-17 AS build
WORKDIR /app

# Copy only pom.xml first (rarely changes)
COPY pom.xml .
RUN mvn dependency:go-offline  # Cached unless pom.xml changes

# Now copy source (changes frequently)
COPY src ./src
RUN mvn package
```

### 2. Using .dockerignore

**.dockerignore**:
```
# Ignore build artifacts
target/
build/
*.jar
*.war

# Ignore IDE files
.idea/
.vscode/
*.iml

# Ignore Git
.git/
.gitignore

# Ignore documentation
docs/
README.md

# Ignore tests
src/test/

# Ignore environment files
.env
.env.local
```

### 3. Minimize Layers

**Bad** (Many layers):
```dockerfile
RUN apt-get update
RUN apt-get install -y curl
RUN apt-get install -y vim
RUN apt-get clean
```

**Good** (Single layer):
```dockerfile
RUN apt-get update && \
    apt-get install -y curl vim && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*
```

### 4. Use Alpine Images

```dockerfile
# Large: 500 MB
FROM openjdk:17

# Small: 170 MB
FROM openjdk:17-alpine

# Smallest: 150 MB
FROM amazoncorretto:17-alpine
```

---

## 5. Environment Variables and Configuration

### Passing Environment Variables

```bash
# Option 1: Command line
docker run -e SPRING_PROFILES_ACTIVE=prod \
           -e DATABASE_URL=jdbc:postgresql://db:5432/mydb \
           my-app

# Option 2: .env file
docker run --env-file .env my-app
```

**.env**:
```
SPRING_PROFILES_ACTIVE=prod
DATABASE_URL=jdbc:postgresql://db:5432/mydb
DATABASE_USERNAME=admin
DATABASE_PASSWORD=secret
```

### Using ARG for Build-Time Variables

```dockerfile
# Define build argument
ARG JAR_FILE=target/*.jar

# Use it
COPY ${JAR_FILE} app.jar
```

```bash
# Override at build time
docker build --build-arg JAR_FILE=target/my-app-2.0.0.jar -t my-app .
```

---

## 6. Docker Compose for Spring Boot

### Basic docker-compose.yml

```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "8080:8080"
    environment:
      SPRING_DATASOURCE_URL: jdbc:postgresql://db:5432/mydb
      SPRING_DATASOURCE_USERNAME: postgres
      SPRING_DATASOURCE_PASSWORD: secret
    depends_on:
      - db
    networks:
      - app-network

  db:
    image: postgres:15-alpine
    environment:
      POSTGRES_DB: mydb
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: secret
    volumes:
      - postgres-data:/var/lib/postgresql/data
    networks:
      - app-network

volumes:
  postgres-data:

networks:
  app-network:
    driver: bridge
```

### Commands

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f app

# Stop all services
docker-compose down

# Stop and remove volumes
docker-compose down -v
```

---

## 7. Advanced Docker Compose

### Complete Stack with Redis, PostgreSQL, and Spring Boot

```yaml
version: '3.8'

services:
  # Spring Boot Application
  app:
    build:
      context: .
      dockerfile: Dockerfile
      args:
        JAR_FILE: target/my-app-1.0.0.jar
    container_name: spring-app
    ports:
      - "8080:8080"
    environment:
      SPRING_PROFILES_ACTIVE: docker
      SPRING_DATASOURCE_URL: jdbc:postgresql://db:5432/appdb
      SPRING_DATASOURCE_USERNAME: appuser
      SPRING_DATASOURCE_PASSWORD: apppassword
      SPRING_REDIS_HOST: redis
      SPRING_REDIS_PORT: 6379
    depends_on:
      db:
        condition: service_healthy
      redis:
        condition: service_started
    networks:
      - backend
    restart: unless-stopped

  # PostgreSQL Database
  db:
    image: postgres:15-alpine
    container_name: postgres-db
    environment:
      POSTGRES_DB: appdb
      POSTGRES_USER: appuser
      POSTGRES_PASSWORD: apppassword
    ports:
      - "5432:5432"
    volumes:
      - postgres-data:/var/lib/postgresql/data
      - ./init.sql:/docker-entrypoint-initdb.d/init.sql
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U appuser -d appdb"]
      interval: 10s
      timeout: 5s
      retries: 5
    networks:
      - backend
    restart: unless-stopped

  # Redis Cache
  redis:
    image: redis:7-alpine
    container_name: redis-cache
    ports:
      - "6379:6379"
    volumes:
      - redis-data:/data
    networks:
      - backend
    restart: unless-stopped

  # Adminer (Database UI)
  adminer:
    image: adminer
    container_name: db-admin
    ports:
      - "8081:8080"
    environment:
      ADMINER_DEFAULT_SERVER: db
    depends_on:
      - db
    networks:
      - backend

volumes:
  postgres-data:
  redis-data:

networks:
  backend:
    driver: bridge
```

---

## 8. Health Checks

### In Dockerfile

```dockerfile
FROM amazoncorretto:17-alpine

WORKDIR /app
COPY target/*.jar app.jar

EXPOSE 8080

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost:8080/actuator/health || exit 1

ENTRYPOINT ["java", "-jar", "app.jar"]
```

### In docker-compose.yml

```yaml
services:
  app:
    build: .
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:8080/actuator/health"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s
```

### Spring Boot Actuator

**pom.xml**:
```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-actuator</artifactId>
</dependency>
```

**application.yml**:
```yaml
management:
  endpoints:
    web:
      exposure:
        include: health,info
  endpoint:
    health:
      show-details: always
```

---

## 9. Production-Ready Dockerfile

```dockerfile
# ==================== Stage 1: Build ====================
FROM maven:3.9-amazoncorretto-17 AS build

WORKDIR /build

# Copy Maven files for dependency caching
COPY pom.xml .
COPY .mvn .mvn
RUN mvn dependency:go-offline -B

# Copy source and build
COPY src ./src
RUN mvn clean package -DskipTests -B

# ==================== Stage 2: Runtime ====================
FROM amazoncorretto:17-alpine

# Install curl for health checks
RUN apk add --no-cache curl

# Create app user
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# Set working directory
WORKDIR /app

# Copy JAR from build stage
COPY --from=build --chown=appuser:appgroup /build/target/*.jar app.jar

# Switch to non-root user
USER appuser

# Expose application port
EXPOSE 8080

# JVM optimization flags
ENV JAVA_OPTS="-XX:+UseG1GC \
               -XX:MaxRAMPercentage=75.0 \
               -XX:InitialRAMPercentage=50.0 \
               -XX:+UseContainerSupport \
               -Djava.security.egd=file:/dev/./urandom"

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=60s --retries=3 \
  CMD curl -f http://localhost:8080/actuator/health || exit 1

# Entry point with JVM options
ENTRYPOINT exec java $JAVA_OPTS -jar app.jar
```

---

## 10. Docker Build Best Practices

### 1. Build Context

```bash
# Bad: Sends entire directory including .git, target/, etc.
docker build .

# Good: Use .dockerignore to exclude unnecessary files
# (See Section 4.2)
```

### 2. Build Arguments

```dockerfile
ARG MAVEN_VERSION=3.9
ARG JAVA_VERSION=17

FROM maven:${MAVEN_VERSION}-amazoncorretto-${JAVA_VERSION} AS build
```

```bash
docker build --build-arg JAVA_VERSION=19 -t my-app .
```

### 3. Image Tags

```bash
# Bad: Only 'latest' tag
docker build -t my-app .

# Good: Semantic versioning
docker build -t my-app:1.2.3 -t my-app:latest .
```

### 4. Build Cache

```bash
# No cache (force rebuild)
docker build --no-cache -t my-app .

# Use build cache from another image
docker build --cache-from my-app:latest -t my-app:1.2.4 .
```

---

## 11. Container Networking in Docker Compose

### Default Network

```yaml
# All services in same network (default)
services:
  app:
    image: my-app
  db:
    image: postgres

# 'app' can reach 'db' via hostname: jdbc:postgresql://db:5432
```

### Custom Networks

```yaml
services:
  frontend:
    image: nginx
    networks:
      - frontend-network

  app:
    image: my-app
    networks:
      - frontend-network
      - backend-network

  db:
    image: postgres
    networks:
      - backend-network

networks:
  frontend-network:
  backend-network:
```

**Result**:
-   `frontend` can reach `app` but NOT `db`
-   `app` can reach both `frontend` and `db`
-   `db` can reach `app` but NOT `frontend`

---

## 12. Volume Management

### Named Volumes

```yaml
services:
  db:
    image: postgres
    volumes:
      - postgres-data:/var/lib/postgresql/data  # Named volume

volumes:
  postgres-data:  # Define volume
```

### Bind Mounts

```yaml
services:
  app:
    image: my-app
    volumes:
      - ./logs:/app/logs  # Bind mount (host → container)
```

### Tmpfs Mounts (In-Memory)

```yaml
services:
  app:
    image: my-app
    tmpfs:
      - /tmp  # Temporary filesystem in RAM
```

---

## 13. Environment-Specific Configuration

### Using Profiles

**docker-compose.yml** (base):
```yaml
services:
  app:
    image: my-app
    environment:
      SPRING_PROFILES_ACTIVE: dev
```

**docker-compose.prod.yml** (production overrides):
```yaml
services:
  app:
    environment:
      SPRING_PROFILES_ACTIVE: prod
      SPRING_DATASOURCE_URL: jdbc:postgresql://prod-db:5432/proddb
    deploy:
      replicas: 3
```

```bash
# Development
docker-compose up

# Production
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up
```

---

## 14. Logging and Monitoring

### Container Logs

```bash
# View logs
docker logs my-app

# Follow logs
docker logs -f my-app

# Last 100 lines
docker logs --tail 100 my-app

# With timestamps
docker logs -t my-app
```

### Logging Drivers

**docker-compose.yml**:
```yaml
services:
  app:
    image: my-app
    logging:
      driver: "json-file"
      options:
        max-size: "10m"
        max-file: "3"
```

### Monitoring with cAdvisor

```yaml
services:
  cadvisor:
    image: gcr.io/cadvisor/cadvisor:latest
    ports:
      - "8082:8080"
    volumes:
      - /:/rootfs:ro
      - /var/run:/var/run:ro
      - /sys:/sys:ro
      - /var/lib/docker/:/var/lib/docker:ro
```

Access: `http://localhost:8082`

---

## 15. Security Best Practices

### 1. Non-Root User

```dockerfile
# Create user
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# Switch to user
USER appuser
```

### 2. Scan Images

```bash
# Using Docker Scout
docker scout quickview my-app:latest

# Using Trivy
trivy image my-app:latest

# Using Snyk
snyk container test my-app:latest
```

### 3. Secrets Management

**Don't hardcode secrets**:
```dockerfile
# BAD
ENV DATABASE_PASSWORD=supersecret
```

**Use Docker Secrets** (Docker Swarm):
```yaml
services:
  app:
    image: my-app
    secrets:
      - db-password

secrets:
  db-password:
    external: true
```

**Or Environment Variables**:
```bash
docker run -e DATABASE_PASSWORD=$(cat /secure/db-password) my-app
```

### 4. Read-Only Filesystem

```yaml
services:
  app:
    image: my-app
    read_only: true
    tmpfs:
      - /tmp
      - /var/cache
```

---

## 16. Best Practices Summary

### Dockerfile
1.  **Multi-stage builds**: Reduce image size.
2.  **Layer caching**: Order commands to maximize cache reuse.
3.  **Use .dockerignore**: Exclude unnecessary files.
4.  **Alpine base images**: Smallest image size.
5.  **Non-root user**: Run as non-root for security.

### Docker Compose
1.  **Health checks**: Define health check for services.
2.  **Networks**: Isolate services with custom networks.
3.  **Volumes**: Persist data with named volumes.
4.  **Restart policies**: Set `restart: unless-stopped` for production.
5.  **Resource limits**: Set CPU and memory limits.

### Security
1.  **Scan images**: Regularly scan for vulnerabilities.
2.  **No secrets in images**: Never bake secrets into images.
3.  **Update base images**: Keep base images updated.
4.  **Minimal permissions**: Run with least privilege.
5.  **Read-only filesystem**: Prevent unwanted file modifications.
