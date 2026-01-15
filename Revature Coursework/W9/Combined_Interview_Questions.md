# Combined Interview Questions

## Microservices Architecture, Kubernetes, Docker, Kafka, Eureka & Spring Gateway

This document consolidates interview questions on the key topics covered in Weeks 8-9, focusing specifically on microservices architecture and related technologies.

---

## Section 1: Microservices Architecture (MSA)

### Q1: What is Microservices Architecture and how does it differ from a Monolithic Architecture?

**Keywords:** Independent Deployment, Bounded Context, Single Responsibility, Scalability
<details>
<summary>Click to Reveal Answer</summary>

**Monolithic Architecture:**

- Single deployable unit
- Shared database
- One technology stack
- Scale entire application

**Microservices Architecture:**

- Independent, loosely coupled services
- Each service owns its data
- Technology flexibility per service
- Independent scaling and deployment

**Key Principles:**

1. Single Responsibility - each service does one thing well
2. Bounded Context - clear service boundaries
3. Decentralized Data - each service manages its own data
4. Design for Failure - assume services can fail

</details>

---

### Q2: What are the advantages and disadvantages of Microservices?

**Keywords:** Scalability, Complexity, Team Autonomy, Distributed Systems
<details>
<summary>Click to Reveal Answer</summary>

**Advantages:**

- Independent deployment and scaling
- Technology flexibility
- Team autonomy and parallel development
- Fault isolation
- Easier to understand individual services

**Disadvantages:**

- Increased complexity (distributed systems)
- Network latency and failures
- Data consistency challenges
- Operational overhead (monitoring, debugging)
- Testing complexity

</details>

---

### Q3: How do microservices communicate with each other?

**Keywords:** REST, gRPC, Message Queue, Synchronous, Asynchronous
<details>
<summary>Click to Reveal Answer</summary>

**Synchronous Communication:**

- **REST/HTTP**: Most common, request-response pattern
- **gRPC**: Binary protocol, faster, uses Protocol Buffers

**Asynchronous Communication:**

- **Message Queues** (Kafka, RabbitMQ): Event-driven, decoupled
- **Event Sourcing**: Store events, rebuild state

**When to use each:**

- Synchronous: Need immediate response
- Asynchronous: Decoupled operations, eventual consistency is acceptable

</details>

---

### Q4: What is the Strangler Fig Pattern?

**Keywords:** Migration, Incremental, Legacy, Gradual Replacement
<details>
<summary>Click to Reveal Answer</summary>

The **Strangler Fig Pattern** is a migration strategy for moving from monolith to microservices:

1. **Identify**: Select a feature/module to extract
2. **Create**: Build new microservice for that feature
3. **Redirect**: Route traffic to new service via API Gateway
4. **Remove**: Delete old code from monolith once stable
5. **Repeat**: Continue until monolith is fully replaced

**Benefits:**

- Low risk - gradual migration
- Continuous delivery during migration
- Can rollback to monolith if issues arise

</details>

---

### Q5: What is the Database per Service pattern?

**Keywords:** Data Ownership, Loose Coupling, Eventual Consistency
<details>
<summary>Click to Reveal Answer</summary>

Each microservice owns and manages its own database:

**Benefits:**

- Loose coupling between services
- Independent schema evolution
- Technology choice per service
- Easier scaling

**Challenges:**

- Cross-service queries are complex
- Data consistency (eventual consistency)
- Distributed transactions

**Solution for cross-service data:**

- API calls between services
- Event-driven data synchronization
- CQRS (Command Query Responsibility Segregation)

</details>

---

## Section 2: Service Discovery & Eureka

### Q6: What is Service Discovery and why is it needed?

**Keywords:** Dynamic IPs, Auto-scaling, Registration, Health Check
<details>
<summary>Click to Reveal Answer</summary>

**Problem:** In microservices, services have dynamic IPs that change due to:

- Container restarts
- Auto-scaling (instances added/removed)
- Failover to different hosts

**Service Discovery solves this by:**

1. **Registration**: Services register themselves on startup
2. **Discovery**: Services query to find other services
3. **Health Monitoring**: Track which instances are healthy
4. **Load Balancing**: Distribute requests across instances

**Without Service Discovery:** Hardcode IPs → breaks when services move
**With Service Discovery:** Ask "Where is service X?" → get healthy instances
</details>

---

### Q7: How does Netflix Eureka work?

**Keywords:** Eureka Server, Eureka Client, Heartbeat, Self-Preservation
<details>
<summary>Click to Reveal Answer</summary>

**Components:**

- **Eureka Server**: Central registry of all services
- **Eureka Client**: Library in each microservice

**How it works:**

1. Service starts → registers with Eureka Server
2. Service sends heartbeats every 30 seconds
3. Other services query Eureka to find instances
4. If heartbeats stop → Eureka removes instance after 90 seconds

**Self-Preservation Mode:**

- Activated when > 15% of clients stop sending heartbeats
- Eureka stops expiring instances (assumes network issue, not service failure)
- Prevents cascading failures during network partitions

</details>

---

### Q8: What is the difference between Eureka's client-side discovery and server-side discovery?

**Keywords:** Load Balancer, Spring Cloud LoadBalancer, Ribbon
<details>
<summary>Click to Reveal Answer</summary>

**Client-Side Discovery (Eureka):**

- Client queries Eureka for service instances
- Client chooses which instance to call
- Client-side load balancing (Spring Cloud LoadBalancer)
- `Client → [knows about server1, server2, server3] → chooses one`

**Server-Side Discovery:**

- Client calls a load balancer
- Load balancer routes to appropriate instance
- Example: AWS ELB, Nginx
- `Client → Load Balancer → [server1, server2, server3]`

**Eureka uses client-side** which reduces single point of failure.
</details>

---

### Q9: How would you configure a Spring Boot application to be a Eureka client?

**Keywords:** @EnableEurekaClient, application.yml, spring-cloud-starter-netflix-eureka-client
<details>
<summary>Click to Reveal Answer</summary>

**1. Add Dependency:**

```xml
<dependency>
    <groupId>org.springframework.cloud</groupId>
    <artifactId>spring-cloud-starter-netflix-eureka-client</artifactId>
</dependency>
```

**2. Configure application.yml:**

```yaml
spring:
  application:
    name: my-service
eureka:
  client:
    service-url:
      defaultZone: http://localhost:8761/eureka
  instance:
    prefer-ip-address: true
```

**3. Main Application:**

```java
@SpringBootApplication
@EnableDiscoveryClient
public class MyServiceApplication { }
```

</details>

---

## Section 3: Spring Cloud Gateway

### Q10: What is an API Gateway and what problems does it solve?

**Keywords:** Single Entry Point, Cross-Cutting Concerns, Routing, Authentication
<details>
<summary>Click to Reveal Answer</summary>

**API Gateway** is a single entry point for all client requests.

**Problems Solved:**

1. **Multiple Endpoints**: Client only knows one URL, gateway routes internally
2. **Authentication**: Centralized auth instead of in each service
3. **Rate Limiting**: Prevent abuse at the edge
4. **Request Aggregation**: Combine data from multiple services
5. **Protocol Translation**: External HTTP, internal gRPC

**Spring Cloud Gateway provides:**

- Route matching (path, header, query param)
- Filters (pre/post processing)
- Load balancing with Eureka integration
- Circuit breaker integration

</details>

---

### Q11: How do you configure routes in Spring Cloud Gateway?

**Keywords:** Predicates, Filters, RouteLocator, YAML Configuration
<details>
<summary>Click to Reveal Answer</summary>

**YAML Configuration:**

```yaml
spring:
  cloud:
    gateway:
      routes:
        - id: user-service
          uri: lb://USER-SERVICE
          predicates:
            - Path=/api/users/**
          filters:
            - StripPrefix=1
```

**Java Configuration:**

```java
@Bean
public RouteLocator routes(RouteLocatorBuilder builder) {
    return builder.routes()
        .route("user-service", r -> r
            .path("/api/users/**")
            .filters(f -> f.stripPrefix(1))
            .uri("lb://USER-SERVICE"))
        .build();
}
```

**Key Concepts:**

- `lb://` prefix enables load balancing via Eureka
- Predicates define when route matches
- Filters modify request/response

</details>

---

### Q12: What are Gateway Filters and what are common use cases?

**Keywords:** Pre-Filter, Post-Filter, AddRequestHeader, RateLimiter
<details>
<summary>Click to Reveal Answer</summary>

**Types:**

- **Pre-Filters**: Execute before routing (auth, rate limiting)
- **Post-Filters**: Execute after response (logging, response modification)

**Common Built-in Filters:**

| Filter | Purpose |
|--------|---------|
| `AddRequestHeader` | Add header to request |
| `AddResponseHeader` | Add header to response |
| `StripPrefix` | Remove path prefix |
| `RewritePath` | Rewrite URL path |
| `RequestRateLimiter` | Rate limiting |
| `CircuitBreaker` | Circuit breaker pattern |

**Custom Filter Example:**

```java
@Component
public class LoggingFilter implements GlobalFilter {
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
        log.info("Request: " + exchange.getRequest().getPath());
        return chain.filter(exchange);
    }
}
```

</details>

---

## Section 4: Apache Kafka

### Q13: What is Apache Kafka and when would you use it?

**Keywords:** Distributed Streaming, Pub-Sub, Event-Driven, High Throughput
<details>
<summary>Click to Reveal Answer</summary>

**Kafka** is a distributed streaming platform for:

- **Messaging**: Publish-subscribe pattern
- **Stream Processing**: Real-time data processing
- **Event Sourcing**: Store events as source of truth

**Use Cases:**

- Real-time analytics
- Log aggregation
- Event-driven microservices
- Change Data Capture (CDC)
- Decoupling services

**Key Characteristics:**

- High throughput (millions of messages/sec)
- Durable (persists to disk)
- Scalable (add brokers/partitions)
- Fault tolerant (replication)

</details>

---

### Q14: Explain Kafka's core concepts: Topics, Partitions, and Consumer Groups

**Keywords:** Ordering, Parallelism, Offset, Replication
<details>
<summary>Click to Reveal Answer</summary>

**Topic:**

- Named stream of records
- Like a table in a database

**Partition:**

- Topic divided into partitions for parallelism
- Messages ordered within partition (not across)
- Each partition stored on different broker

**Consumer Group:**

- Multiple consumers sharing load
- Each partition consumed by ONE consumer in group
- Add consumers for parallelism (up to partition count)

**Offset:**

- Position of message in partition
- Consumer tracks offset to resume after failure

```
Topic: orders
├── Partition 0: [0][1][2][3][4]  → Consumer A
├── Partition 1: [0][1][2][3]    → Consumer B
└── Partition 2: [0][1][2]       → Consumer C
```

</details>

---

### Q15: What is the difference between Kafka and traditional message queues (like RabbitMQ)?

**Keywords:** Log-Based, Retention, Replay, Point-to-Point
<details>
<summary>Click to Reveal Answer</summary>

| Aspect | Kafka | RabbitMQ |
|--------|-------|----------|
| **Model** | Distributed log | Message queue |
| **Retention** | Configurable (days/size) | Until consumed |
| **Replay** | Can replay old messages | Once consumed, gone |
| **Ordering** | Per partition | Per queue |
| **Use Case** | Streaming, event sourcing | Task queues, RPC |
| **Throughput** | Very high | High |

**Choose Kafka when:**

- Need to replay messages
- Event sourcing architecture
- Very high throughput required
- Multiple consumers for same data

</details>

---

### Q16: How do you implement Kafka in a Spring Boot application?

**Keywords:** @KafkaListener, KafkaTemplate, spring-kafka
<details>
<summary>Click to Reveal Answer</summary>

**1. Add Dependency:**

```xml
<dependency>
    <groupId>org.springframework.kafka</groupId>
    <artifactId>spring-kafka</artifactId>
</dependency>
```

**2. Configure:**

```yaml
spring:
  kafka:
    bootstrap-servers: localhost:9092
    consumer:
      group-id: my-group
      auto-offset-reset: earliest
```

**3. Producer:**

```java
@Service
public class OrderProducer {
    @Autowired
    private KafkaTemplate<String, Order> kafkaTemplate;
    
    public void sendOrder(Order order) {
        kafkaTemplate.send("orders", order.getId(), order);
    }
}
```

**4. Consumer:**

```java
@Service
public class OrderConsumer {
    @KafkaListener(topics = "orders", groupId = "my-group")
    public void consume(Order order) {
        log.info("Received order: " + order);
    }
}
```

</details>

---

### Q17: How does Kafka ensure message delivery and what are the delivery semantics?

**Keywords:** At-Most-Once, At-Least-Once, Exactly-Once, Acks
<details>
<summary>Click to Reveal Answer</summary>

**Delivery Semantics:**

| Semantic | Guarantee | Configuration |
|----------|-----------|---------------|
| **At-Most-Once** | May lose messages | acks=0, no retry |
| **At-Least-Once** | May duplicate | acks=all, retry enabled |
| **Exactly-Once** | No loss or duplicates | Idempotent producer + transactions |

**Producer Acks:**

- `acks=0`: Don't wait for acknowledgment
- `acks=1`: Wait for leader acknowledgment
- `acks=all`: Wait for all replicas

**Consumer Offset Commit:**

- Auto-commit: May lose or duplicate
- Manual commit: Better control

</details>

---

## Section 5: Docker

### Q18: What is the difference between Docker images and containers?

**Keywords:** Blueprint, Running Instance, Immutable, Layered
<details>
<summary>Click to Reveal Answer</summary>

**Docker Image:**

- Read-only template/blueprint
- Contains application + dependencies
- Built from Dockerfile
- Immutable - cannot be changed
- Stored in registry

**Docker Container:**

- Running instance of an image
- Has writable layer on top
- Can be started, stopped, deleted
- Isolated process with own filesystem, network

**Analogy:** Image is like a class, Container is like an object/instance.
</details>

---

### Q19: Explain Docker multi-stage builds and their benefits

**Keywords:** Build Stage, Runtime Stage, Image Size, Security
<details>
<summary>Click to Reveal Answer</summary>

**Multi-stage builds** use multiple FROM statements:

```dockerfile
# Stage 1: Build
FROM maven:3.9-jdk-17 AS build
COPY . .
RUN mvn package -DskipTests

# Stage 2: Runtime
FROM eclipse-temurin:17-jre-alpine
COPY --from=build target/*.jar app.jar
ENTRYPOINT ["java", "-jar", "app.jar"]
```

**Benefits:**

- **Smaller images**: Final image has no build tools
- **Faster deployments**: Less to transfer
- **Better security**: Fewer packages = smaller attack surface
- **Single Dockerfile**: No need for separate build scripts

**Typical reduction:** 850MB → 250MB (70% smaller)
</details>

---

### Q20: How does Docker networking work?

**Keywords:** Bridge, Host, Overlay, Container Communication
<details>
<summary>Click to Reveal Answer</summary>

**Network Types:**

| Type | Use Case |
|------|----------|
| **bridge** | Default, containers on same host |
| **host** | Container uses host's network |
| **overlay** | Multi-host (Docker Swarm) |
| **none** | No networking |

**Container Communication:**

- Same network: Use container name as hostname
- Different networks: Cannot communicate directly

**Docker Compose Example:**

```yaml
services:
  app:
    networks:
      - backend
  db:
    networks:
      - backend
networks:
  backend:
```

Containers on same network can reach each other by service name.
</details>

---

### Q21: What are Docker volumes and why are they important?

**Keywords:** Persistent Storage, Bind Mount, Named Volume
<details>
<summary>Click to Reveal Answer</summary>

**Problem:** Container data is lost when container is removed.

**Solutions:**

1. **Named Volumes** (recommended):

   ```bash
   docker run -v mydata:/app/data myimage
   ```

   - Managed by Docker
   - Portable across hosts

2. **Bind Mounts**:

   ```bash
   docker run -v /host/path:/container/path myimage
   ```

   - Maps host directory to container
   - Good for development

**Use Cases:**

- Database storage (PostgreSQL, MongoDB)
- Configuration files
- Log files
- Sharing data between containers

</details>

---

## Section 6: Kubernetes

### Q22: What is Kubernetes and what problems does it solve?

**Keywords:** Container Orchestration, Scheduling, Self-Healing, Scaling
<details>
<summary>Click to Reveal Answer</summary>

**Kubernetes (K8s)** is a container orchestration platform that:

1. **Scheduling**: Decides which node runs which container
2. **Scaling**: Scale up/down based on demand
3. **Self-Healing**: Restarts failed containers
4. **Load Balancing**: Distributes traffic
5. **Rolling Updates**: Zero-downtime deployments
6. **Service Discovery**: Built-in DNS

**Without K8s:** Manually manage containers across servers
**With K8s:** Declare desired state, K8s makes it happen
</details>

---

### Q23: Explain the difference between a Pod, Deployment, and Service in Kubernetes

**Keywords:** Smallest Unit, Replicas, Network Endpoint
<details>
<summary>Click to Reveal Answer</summary>

**Pod:**

- Smallest deployable unit
- One or more containers sharing network/storage
- Ephemeral (can be killed and recreated)

**Deployment:**

- Manages Pod replicas
- Handles rolling updates and rollbacks
- Ensures desired number of pods running

**Service:**

- Stable network endpoint for pods
- Load balances across pod replicas
- Types: ClusterIP, NodePort, LoadBalancer

```
Deployment → manages → Pods
Service → routes traffic to → Pods
```

</details>

---

### Q24: How does Kubernetes handle application configuration and secrets?

**Keywords:** ConfigMap, Secret, Environment Variables, Volume Mount
<details>
<summary>Click to Reveal Answer</summary>

**ConfigMap** (non-sensitive data):

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: app-config
data:
  DATABASE_HOST: "postgres"
  LOG_LEVEL: "INFO"
```

**Secret** (sensitive data):

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: db-secret
type: Opaque
data:
  password: cGFzc3dvcmQ=  # base64 encoded
```

**Usage in Pod:**

```yaml
env:
  - name: DB_PASSWORD
    valueFrom:
      secretKeyRef:
        name: db-secret
        key: password
```

</details>

---

### Q25: What is a Kubernetes Ingress and how does it differ from a Service?

**Keywords:** HTTP Routing, TLS Termination, Path-Based Routing
<details>
<summary>Click to Reveal Answer</summary>

**Service** (Layer 4):

- Routes traffic to pods
- TCP/UDP load balancing
- ClusterIP/NodePort/LoadBalancer

**Ingress** (Layer 7):

- HTTP/HTTPS routing
- Path-based routing
- Host-based routing
- TLS termination

**Ingress Example:**

```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: my-ingress
spec:
  rules:
    - host: api.example.com
      http:
        paths:
          - path: /users
            backend:
              service:
                name: user-service
                port:
                  number: 80
          - path: /orders
            backend:
              service:
                name: order-service
                port:
                  number: 80
```

</details>

---

## Section 7: Scenario-Based Questions

### Q26: Design a microservices architecture for an e-commerce application

**Keywords:** Service Decomposition, API Gateway, Event-Driven
<details>
<summary>Click to Reveal Answer</summary>

**Services:**

- **User Service**: Authentication, profiles
- **Product Service**: Catalog, inventory
- **Order Service**: Order management
- **Payment Service**: Payment processing
- **Notification Service**: Emails, SMS

**Infrastructure:**

- **API Gateway**: Spring Cloud Gateway (routing, auth)
- **Service Discovery**: Eureka
- **Messaging**: Kafka (order events, notifications)
- **Databases**: Each service has own DB

**Communication:**

- Synchronous: User → Gateway → Product Service (get products)
- Asynchronous: Order placed → Kafka → Notification Service

</details>

---

### Q27: Your Kafka consumer is lagging behind. How do you troubleshoot and fix it?

**Keywords:** Consumer Lag, Partitions, Processing Time
<details>
<summary>Click to Reveal Answer</summary>

**Diagnose:**

1. Check consumer lag: `kafka-consumer-groups --describe`
2. Monitor processing time per message
3. Check for errors/exceptions

**Solutions:**

1. **Add partitions**: More parallelism
2. **Add consumers**: Up to partition count
3. **Optimize processing**: Async processing, batching
4. **Increase fetch size**: Fetch more messages per request
5. **Check external dependencies**: Slow database calls?

**Prevention:**

- Monitor lag metrics
- Set up alerts
- Right-size partition count initially

</details>

---

### Q28: How would you implement a circuit breaker in a microservices architecture?

**Keywords:** Resilience4j, Fallback, States, Timeout
<details>
<summary>Click to Reveal Answer</summary>

**Using Resilience4j with Spring Cloud:**

```java
@CircuitBreaker(name = "orderService", fallbackMethod = "fallback")
public Order getOrder(String id) {
    return orderClient.getOrder(id);  // May fail
}

public Order fallback(String id, Exception e) {
    return new Order(id, "UNKNOWN");  // Graceful degradation
}
```

**Configuration:**

```yaml
resilience4j:
  circuitbreaker:
    instances:
      orderService:
        slidingWindowSize: 10
        failureRateThreshold: 50
        waitDurationInOpenState: 10s
```

**States:**

- CLOSED: Normal operation
- OPEN: Fail fast after threshold
- HALF-OPEN: Test recovery

</details>

---

### Q29: How do you ensure data consistency across microservices without distributed transactions?

**Keywords:** Saga Pattern, Eventual Consistency, Compensation
<details>
<summary>Click to Reveal Answer</summary>

**Saga Pattern:**
A saga is a sequence of local transactions where each service:

1. Completes its transaction
2. Publishes an event
3. Next service reacts to event

**Compensation:**
If a step fails, execute compensating transactions to undo previous steps.

**Example - Order Saga:**

1. Order Service: Create order (PENDING)
2. Payment Service: Process payment
3. Inventory Service: Reserve items
4. Order Service: Confirm order

**If Payment fails:** Cancel order (compensating action)

**Implementation:**

- Choreography: Services publish events
- Orchestration: Central coordinator manages saga

</details>

---

## Quick Reference Cheat Sheet

### Eureka Commands

```bash
# Eureka Server: http://localhost:8761
# Check registered services: GET /eureka/apps
```

### Kafka Commands

```bash
# Create topic
kafka-topics --create --topic orders --bootstrap-server localhost:9092

# List topics  
kafka-topics --list --bootstrap-server localhost:9092

# Consume messages
kafka-console-consumer --topic orders --from-beginning --bootstrap-server localhost:9092

# Check consumer lag
kafka-consumer-groups --describe --group my-group --bootstrap-server localhost:9092
```

### Docker Commands

```bash
# Build
docker build -t myapp:latest .

# Run
docker run -d -p 8080:8080 --name myapp myapp:latest

# Logs
docker logs myapp

# Exec into container
docker exec -it myapp /bin/sh
```

### Kubernetes Commands

```bash
# Apply configuration
kubectl apply -f deployment.yaml

# Get resources
kubectl get pods,svc,deployments

# Describe pod
kubectl describe pod <pod-name>

# Logs
kubectl logs <pod-name>

# Scale
kubectl scale deployment myapp --replicas=5

# Rollout
kubectl rollout status deployment/myapp
kubectl rollout undo deployment/myapp
```
