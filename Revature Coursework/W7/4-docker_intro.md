# Week 8 - Thursday: Introduction to Docker

## 1. Introduction to Docker

### What is Docker?

**Docker** is a platform for developing, shipping

, and running applications in **containers**. It enables you to package an application with all its dependencies into a standardized unit called a container.

### The Problem Docker Solves

#### "Works on My Machine" Syndrome

```
Developer's Laptop:
├── Java 17
├── Spring Boot 3.0
├── PostgreSQL 14
└── Node.js 18
        ✅ Application works perfectly

Production Server:
├── Java 11 (different version!)
├── Missing SpringBoot dependencies
├── MySQL (different database!)
└── Node.js 16
        ❌ Application crashes
```

**Docker Solution**: Bundle the application WITH its exact environment.

---

## 2. Containers vs VMs

### Virtual Machines (VMs)

```
┌─────────────────────────────────────┐
│         Physical Server             │
│  ┌───────────────────────────────┐  │
│  │       Hypervisor (ESXi)       │  │
│  ├───────────┬─────────┬─────────┤  │
│  │   VM 1    │  VM 2   │  VM 3   │  │
│  │           │         │         │  │
│  │ Guest OS  │Guest OS │Guest OS │  │
│  │ (Ubuntu)  │(CentOS) │(Windows)│  │
│  │           │         │         │  │
│  │   App A   │  App B  │  App C  │  │
│  └───────────┴─────────┴─────────┘  │
└─────────────────────────────────────┘
```

### Containers

```
┌─────────────────────────────────────┐
│         Physical Server             │
│  ┌───────────────────────────────┐  │
│  │       Host OS (Linux)         │  │
│  ├───────────────────────────────┤  │
│  │       Docker Engine            │  │
│  ├─────────┬─────────┬─────────┬──┤  │
│  │Container│Container│Container│  │  │
│  │    1    │    2    │    3    │  │  │
│  │  App A  │  App B  │  App C  │  │  │
│  │ + Libs  │ + Libs  │ + Libs  │  │  │
│  └─────────┴─────────┴─────────┴──┘  │
└─────────────────────────────────────┘
```

### Comparison Table

| Aspect | Virtual Machines | Containers |
| :--- | :--- | :--- |
| **Isolation** | Complete OS isolation | Process-level isolation |
| **Startup Time** | Minutes | Seconds |
| **Size** | GBs (entire OS) | MBs (just app + dependencies) |
| **Performance** | Slower (overhead of full OS) | Near-native (shares host kernel) |
| **Resource Usage** | Heavy (each VM has full OS) | Light (shared kernel) |
| **Portability** | Limited (VM images are large) | High (container images are small) |
| **Use Case** | Run different OSes, strong isolation | Microservices, CI/CD, scaling |

### When to Use VMs vs Containers

**Use VMs When**:
-   Need complete OS isolation (security).
-   Running different operating systems (Windows app on Linux host).
-   Legacy applications that can't be containerized.

**Use Containers When**:
-   Microservices architecture.
-   CI/CD pipelines.
-   Need rapid scaling.
-   Cloud-native applications.

---

## 3. Containerization

### What is Containerization?

**Containerization** is the process of packaging an application and its dependencies into a container that can run consistently across different environments.

### Benefits of Containerization

| Benefit | Description |
| :--- | :--- |
| **Consistency** | Same environment in dev, staging, and production |
| **Portability** | Run anywhere (laptop, data center, cloud) |
| **Efficiency** | Lightweight, fast startup, low overhead |
| **Isolation** | Applications don't interfere with each other |
| **Scalability** | Spin up/down instances quickly |
| **DevOps Enabler** | Facilitates CI/CD pipelines |

### Container Lifecycle

```
┌──────────┐   docker run    ┌───────────┐
│  Image   │ ──────────────▶ │ Container │
│ (Template)│                 │ (Running) │
└──────────┘                 └─────┬─────┘
     ▲                             │
     │ docker build                │ docker stop
     │                             ▼
┌──────────┐                 ┌───────────┐
│Dockerfile│                 │ Container │
│          │                 │ (Stopped) │
└──────────┘                 └─────┬─────┘
                                   │ docker start
                                   │
                                   ▼
                             ┌───────────┐
                             │ Container │
                             │ (Running) │
                             └───────────┘
```

---

## 4. Docker Architecture

### Docker Components

```
┌─────────────────────────────────────────────┐
│              Docker Client                  │
│  (docker CLI)                               │
│  $ docker run                               │
│  $ docker build                             │
│  $ docker pull                              │
└──────────────┬──────────────────────────────┘
               │ REST API
               ▼
┌─────────────────────────────────────────────┐
│            Docker Daemon                    │
│         (dockerd)                           │
│                                             │
│  ┌────────────────────────────────────┐    │
│  │  Container Runtime (containerd)    │    │
│  │  ┌──────────┐  ┌──────────┐       │    │
│  │  │Container1│  │Container2│       │    │
│  │  └──────────┘  └──────────┘       │    │
│  └────────────────────────────────────┘    │
│                                             │
│  ┌────────────────────────────────────┐    │
│  │        Images & Volumes            │    │
│  │  - my-app:latest                   │    │
│  │  - nginx:alpine                    │    │
│  │  - postgres_data (volume)          │    │
│  └────────────────────────────────────┘    │
└──────────────┬──────────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────────┐
│          Docker Registry                    │
│        (Docker Hub, private registry)       │
│  - nginx                                    │
│  - postgres                                 │
│  - openjdk                                  │
└─────────────────────────────────────────────┘
```

### Key Components

| Component | Description |
| :--- | :--- |
| **Docker Client** | CLI tool (`docker` command) used to interact with Docker |
| **Docker Daemon** | Background service that manages containers (`dockerd`) |
| **Docker Images** | Read-only templates used to create containers |
| **Docker Containers** | Running instances of Docker images |
| **Docker Registry** | Repository for Docker images (Docker Hub, ECR, etc.) |
| **Docker Volumes** | Persistent data storage for containers |
| **Docker Networks** | Virtual networks for container communication |

---

## 5. Docker Installation and Setup

### Installing on Linux (Ubuntu)

```bash
# Update package index
sudo apt-get update

# Install prerequisites
sudo apt-get install -y \
    apt-transport-https \
    ca-certificates \
    curl \
    gnupg \
    lsb-release

# Add Docker's official GPG key
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg

# Set up stable repository
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu \
  $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# Install Docker Engine
sudo apt-get update
sudo apt-get install -y docker-ce docker-ce-cli containerd.io

# Verify installation
docker --version
```

### Installing on macOS

```bash
# Download Docker Desktop from docker.com
# Or use Homebrew:
brew install --cask docker

# Start Docker Desktop application
open -a Docker

# Verify installation
docker --version
```

### Installing on Windows

1.  Download **Docker Desktop** from [docker.com](https://docker.com)
2.  Run installer
3.  Enable WSL 2 (Windows Subsystem for Linux)
4.  Restart computer
5.  Start Docker Desktop
6.  Verify: `docker --version`

### Post-Installation (Linux)

```bash
# Add user to docker group (avoid needing sudo)
sudo usermod -aG docker $USER

# Log out and log back in, then test
docker run hello-world
```

---

## 6. Docker Containers

### What is a Container?

A **container** is a runnable instance of an image. It's an isolated process that includes:
-   Application code
-   Runtime (e.g., JVM, Node.js)
-   System libraries
-   Dependencies
-   Settings

### Container Properties

-   **Ephemeral**: Containers are temporary; data is lost when stopped (unless using volumes).
-   **Isolated**: Each container has its own filesystem, network, and process space.
-   **Lightweight**: Shares the host OS kernel.
-   **Portable**: Run the same container image anywhere.

### Container States

```
         docker run
  ┌────────────────────┐
  │                    │
  ▼                    │
CREATED ──▶ RUNNING ──▶│──▶ PAUSED
  ▲           │        │      │
  │           │        │      │ docker unpause
  │           │        │      ▼
  │           │        └──▶ RUNNING
  │           │
  │           │ docker stop
  │           ▼
  └────── STOPPED
            │
            │ docker rm
            ▼
         DELETED
```

### Basic Container Operations

#### Running a Container

```bash
# Run nginx web server
docker run -d -p 8080:80 --name my-nginx nginx

# Breakdown:
# -d: Run in detached mode (background)
# -p 8080:80: Map host port 8080 to container port 80
# --name my-nginx: Name the container
# nginx: Image to use
```

#### Listing Containers

```bash
# List running containers
docker ps

# List all containers (including stopped)
docker ps -a
```

Output:
```
CONTAINER ID   IMAGE     COMMAND                  CREATED         STATUS         PORTS                  NAMES
abc123456789   nginx     "/docker-entrypoint.…"   2 minutes ago   Up 2 minutes   0.0.0.0:8080->80/tcp   my-nginx
```

#### Stopping and Starting Containers

```bash
# Stop a container
docker stop my-nginx

# Start a stopped container
docker start my-nginx

# Restart a container
docker restart my-nginx
```

#### Viewing Container Logs

```bash
# View logs
docker logs my-nginx

# Follow logs (like tail -f)
docker logs -f my-nginx

# Last 100 lines
docker logs --tail 100 my-nginx
```

#### Executing Commands in Running Container

```bash
# Execute a command
docker exec my-nginx ls -la /usr/share/nginx/html

# Interactive shell
docker exec -it my-nginx /bin/bash

# Inside container:
root@abc123456789:/# whoami
root
root@abc123456789:/# exit
```

#### Inspecting Containers

```bash
# Get detailed information
docker inspect my-nginx

# Get specific field (IP address)
docker inspect -f '{{.NetworkSettings.IPAddress}}' my-nginx
```

#### Removing Containers

```bash
# Remove a stopped container
docker rm my-nginx

# Force remove a running container
docker rm -f my-nginx

# Remove all stopped containers
docker container prune
```

---

## 7. Docker Images

### What is a Docker Image?

A **Docker image** is a read-only template that contains:
-   Application code
-   Runtime
-   Libraries
-   Environment variables
-   Configuration files

### Image Layers

Images are built in **layers**. Each layer represents a change/instruction in the Dockerfile.

```
┌──────────────────────────┐
│  Application Code        │ ← Layer 4 (Smallest)
├──────────────────────────┤
│  Dependencies (npm, jars)│ ← Layer 3
├──────────────────────────┤
│  Runtime (Node.js, JDK)  │ ← Layer 2
├──────────────────────────┤
│  Base OS (Ubuntu)        │ ← Layer 1 (Largest)
└──────────────────────────┘
```

**Benefits of Layers**:
-   **Caching**: Unchanged layers are reused.
-   **Efficiency**: Multiple images can share layers.
-   **Fast Builds**: Only rebuild changed layers.

### Image Naming

```
registry/repository:tag

Examples:
├── nginx:latest
├── nginx:1.21-alpine
├── docker.io/library/postgres:14
└── myregistry.com/myapp:v1.2.3
```

-   **Registry**: Where images are stored (default: docker.io).
-   **Repository**: The image name.
-   **Tag**: Version/variant (default: latest).

### Pulling Images

```bash
# Pull latest nginx
docker pull nginx

# Pull specific version
docker pull nginx:1.21-alpine

# Pull from private registry
docker pull myregistry.com/myapp:v1.2.3
```

### Listing Images

```bash
# List all images
docker images

# List images with details
docker images --no-trunc
```

Output:
```
REPOSITORY   TAG       IMAGE ID       CREATED        SIZE
nginx        latest    abc123def456   2 weeks ago    133MB
postgres     14        def456ghi789   3 weeks ago    376MB
myapp        v1.0      ghi789jkl012   1 hour ago     512MB
```

### Removing Images

```bash
# Remove an image
docker rmi nginx:latest

# Force remove
docker rmi -f nginx:latest

# Remove all unused images
docker image prune -a
```

---

## 8. Docker Networking

### Network Drivers

| Driver | Description | Use Case |
| :--- | :--- | :--- |
| **bridge** (default) | Private network on host | Containers on same host |
| **host** | Use host's network directly | High performance, no isolation |
| **none** | No networking | Completely isolated |
| **overlay** | Multi-host networking | Docker Swarm, Kubernetes |
| **macvlan** | Assign MAC address to container | Legacy apps needing direct network access |

### Bridge Network (Default)

```bash
# Create a custom bridge network
docker network create my-network

# Run containers on custom network
docker run -d --name db --network my-network postgres
docker run -d --name app --network my-network myapp

# Containers can communicate using container names:# In 'app' container:
# psql -h db -U postgres (uses container name 'db')
```

### Listing Networks

```bash
docker network ls
```

Output:
```
NETWORK ID     NAME         DRIVER    SCOPE
abc123456789   bridge       bridge    local
def456789012   host         host      local
ghi789012345   my-network   bridge    local
```

### Inspecting Networks

```bash
docker network inspect my-network
```

---

## 9. Docker Volumes

### What are Volumes?

**Volumes** are the preferred way to persist data generated by and used by Docker containers.

### Why Use Volumes?

-   **Data Persistence**: Data survives container deletion.
-   **Sharing Data**: Multiple containers can share the same volume.
-   **Performance**: Better performance than bind mounts on Windows/Mac.
-   **Backup/Restore**: Easier to back up volumes.

### Volume Types

| Type | Description | Example |
| :--- | :--- | :--- |
| **Named Volume** | Managed by Docker | `docker volume create my-data` |
| **Anonymous Volume** | Automatically created | `-v /var/lib/data` |
| **Bind Mount** | Mount host directory | `-v /host/path:/container/path` |

### Creating Volumes

```bash
# Create a named volume
docker volume create postgres-data

# List volumes
docker volume ls

# Inspect volume
docker volume inspect postgres-data
```

### Using Volumes

```bash
# Run PostgreSQL with named volume
docker run -d \
  --name mydb \
  -e POSTGRES_PASSWORD=secret \
  -v postgres-data:/var/lib/postgresql/data \
  postgres:14

# Data in /var/lib/postgresql/data is persisted in 'postgres-data' volume
```

### Bind Mounts

```bash
# Mount host directory into container
docker run -d \
  --name mynginx \
  -p 8080:80 \
  -v /home/user/website:/usr/share/nginx/html \
  nginx

# Files in /home/user/website are served by nginx
```

### Removing Volumes

```bash
# Remove a volume
docker volume rm postgres-data

# Remove all unused volumes
docker volume prune
```

---

## 10. Containerization & Orchestration

### Containerization

**Containerization** is packaging applications into containers. This is what Docker does.

### Orchestration

**Orchestration** is managing multiple containers across multiple hosts:
-   **Scheduling**: Decide which host runs which container.
-   **Scaling**: Increase/decrease container replicas.
-   **Load Balancing**: Distribute traffic across containers.
-   **Health Monitoring**: Restart failed containers.
-   **Service Discovery**: Containers find each other.
-   **Rolling Updates**: Zero-downtime deployments.

### Orchestration Tools

| Tool | Description |
| :--- | :--- |
| **Docker Compose** | Multi-container applications on single host |
| **Docker Swarm** | Native Docker clustering |
| **Kubernetes** | Industry-standard container orchestration |
| **AWS ECS/EKS** | AWS container services |
| **Azure AKS** | Azure Kubernetes Service |

---

## 11. Docker Compose (Introduction)

**Docker Compose** is a tool for defining and running multi-container applications using a YAML file.

### docker-compose.yml Example

```yaml
version: '3.8'

services:
  db:
    image: postgres:14
    environment:
      POSTGRES_PASSWORD: secret
      POSTGRES_USER: myuser
      POSTGRES_DB: mydb
    volumes:
      - postgres-data:/var/lib/postgresql/data
    networks:
      - backend

  app:
    image: myapp:latest
    ports:
      - "8080:8080"
    environment:
      DB_HOST: db
      DB_PORT: 5432
      DB_NAME: mydb
      DB_USER: myuser
      DB_PASSWORD: secret
    depends_on:
      - db
    networks:
      - backend

volumes:
  postgres-data:

networks:
  backend:
```

### Commands

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop all services
docker-compose down

# Rebuild and restart
docker-compose up -d --build
```

---

## 12. Docker Use Cases

### 1. Development Environments

**Problem**: Setting up development environment is time-consuming.

**Solution**: Share Docker Compose file with team.

```yaml
# docker-compose.dev.yml
services:
  db:
    image: postgres:14
  redis:
    image: redis:alpine
  app:
    build: .
    volumes:
      - .:/app  # Live code reload
```

```bash
docker-compose -f docker-compose.dev.yml up
```

### 2. CI/CD Pipelines

**Use in Jenkins**:
```groovy
stage('Build') {
    steps {
        sh 'docker build -t myapp:${BUILD_NUMBER} .'
    }
}

stage('Test') {
    steps {
        sh 'docker run myapp:${BUILD_NUMBER} npm test'
    }
}

stage('Push') {
    steps {
        sh 'docker push myregistry.com/myapp:${BUILD_NUMBER}'
    }
}
```

### 3. Microservices

Each microservice runs in its own container:
```bash
docker run -d user-service:latest
docker run -d order-service:latest
docker run -d payment-service:latest
```

### 4. Testing Across Different Environments

```bash
# Test on Node.js 16
docker run -v $(pwd):/app node:16 npm test

# Test on Node.js 18
docker run -v $(pwd):/app node:18 npm test

# Test on Node.js 20
docker run -v $(pwd):/app node:20 npm test
```

---

## 13. Best Practices

### Image Building
1.  **Use Official Base Images**: Start from trusted images.
2.  **Minimize Layers**: Combine RUN commands.
3.  **Use .dockerignore**: Exclude unnecessary files.
4.  **Multi-Stage Builds**: Reduce final image size.
5.  **Tag Images Properly**: Use semantic versioning.

### Container Running
1.  **One Process Per Container**: Single responsibility principle.
2.  **Use Volumes**: Persist important data.
3.  **Don't Run as Root**: Use non-root users for security.
4.  **Resource Limits**: Set memory and CPU limits.
5.  **Health Checks**: Define health check endpoints.

### Security
1.  **Scan Images**: Use tools like Trivy, Clair.
2.  **Keep Images Updated**: Regularly update base images.
3.  **Secrets Management**: Don't hardcode secrets.
4.  **Least Privilege**: Run with minimum permissions.
5.  **Network Segmentation**: Use custom networks.

### Performance
1.  **Layer Caching**: Order Dockerfile commands properly.
2.  **Alpine Images**: Use smaller base images.
3.  **Clean Up**: Remove unused images and containers.
4.  **Logging**: Configure log rotation.
5.  **Monitoring**: Use tools like Prometheus, cAdvisor.
