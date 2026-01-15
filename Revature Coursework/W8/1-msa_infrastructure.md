# Week 8 - Monday: Microservices Infrastructure with Spring Cloud

## Week 8 Overview
This week focuses on **Microservices Infrastructure, Micro Frontends, DevOps, and Containerization**:
-   **Monday**: Spring Cloud (Service Discovery, API Gateway, Config Server, Circuit Breaker)
-   **Tuesday**: Micro Frontends (Architecture, Tools, Implementation Patterns)
-   **Wednesday**: DevOps and CI/CD (Jenkins, Pipelines, Webhooks)
-   **Thursday**: Docker Fundamentals (Containers vs VMs, Architecture, Installation)
-   **Friday**: Dockerizing Applications (Dockerfile, Images, Docker CLI, DockerHub)

---

## 1. Microservice - Spring Cloud

**Spring Cloud** is a collection of tools and frameworks for building cloud-native microservices applications. It provides solutions to common distributed systems challenges.

### What is Spring Cloud?
-   **Definition**: A framework built on top of Spring Boot to simplify development of distributed systems.
-   **Purpose**: Addresses challenges like service discovery, configuration management, load balancing, circuit breaking, and distributed tracing.
-   **Ecosystem**: Integrates with Netflix OSS, Consul, Kubernetes, and other cloud platforms.

### Core Problems Spring Cloud Solves

| Problem | Traditional Solution | Spring Cloud Solution |
| :--- | :--- | :--- |
| **Service Discovery** | Hardcoded IPs, DNS | Netflix Eureka, Consul |
| **Load Balancing** | Hardware load balancer, Nginx | Spring Cloud LoadBalancer, Ribbon |
| **Configuration** | Property files on each service | Spring Cloud Config Server |
| **API Gateway** | Reverse proxy (Nginx, HAProxy) | Spring Cloud Gateway |
| **Resilience** | Manual retry logic, timeouts | Resilience4j, Circuit Breaker |
| **Distributed Tracing** | Custom correlation IDs | Spring Cloud Sleuth, Micrometer |

---

## 2. Discovery Service and Netflix Eureka Server

### The Service Discovery Problem

In a microservices architecture:
-   Services are deployed across multiple servers.
-   Instances can scale up/down dynamically (auto-scaling).
-   IP addresses change frequently.
-   Services need to call each other without hardcoded addresses.

**Traditional Approach (Doesn't Scale)**:
```java
// Hardcoded IP - BAD!
String orderServiceUrl = "http://192.168.1.10:8080/orders";
restTemplate.getForObject(orderServiceUrl + "/123", Order.class);
```

**Problems**:
- IP changes require code changes and redeployment.
- No automatic discovery of new instances.
- Manual load balancing.

### Service Discovery Pattern

**How It Works**:
1.  **Service Registration**: When a service instance starts, it registers itself with the Discovery Server (provides its name, IP, port).
2.  **Service Discovery**: When Service A wants to call Service B, it queries the Discovery Server for Service B's location.
3.  **Health Checks**: Discovery Server periodically checks if services are healthy (heartbeat).
4.  **Deregistration**: When a service instance stops, it deregisters (or is removed after missing heartbeats).

```
┌──────────────┐         ┌──────────────┐
│  Service A   │         │  Service B   │
│ (User API)   │         │ (Order API)  │
└──────┬───────┘         └──────┬───────┘
       │ Register               │ Register
       │ "user-service"         │ "order-service"
       │ 192.168.1.5:8081       │ 192.168.1.6:8082
       ▼                        ▼
┌──────────────────────────────────────┐
│       Eureka Server (Discovery)      │
│  Registry:                           │
│  - user-service: [192.168.1.5:8081]  │
│  - order-service: [192.168.1.6:8082] │
└──────────────────────────────────────┘
       ▲
       │ Query: "Where is order-service?"
       │ Response: "192.168.1.6:8082"
       │
┌──────┴───────┐
│  Service A   │
└──────────────┘
```

---

## 3. Netflix Eureka Server

**Netflix Eureka** is a service registry for resilient mid-tier load balancing and failover.

### Setting Up Eureka Server

#### Step 1: Create Eureka Server Application

**Dependency** (`pom.xml`):
```xml
<dependency>
    <groupId>org.springframework.cloud</groupId>
    <artifactId>spring-cloud-starter-netflix-eureka-server</artifactId>
</dependency>
```

**Main Class**:
```java
@SpringBootApplication
@EnableEurekaServer
public class EurekaServerApplication {
    public static void main(String[] args) {
        SpringApplication.run(EurekaServerApplication.class, args);
    }
}
```

**Configuration** (`application.properties`):
```properties
spring.application.name=eureka-server
server.port=8761

# Don't register itself as a client
eureka.client.register-with-eureka=false
eureka.client.fetch-registry=false

# Server configuration
eureka.server.enable-self-preservation=false
eureka.server.eviction-interval-timer-in-ms=5000
```

#### Step 2: Register Services with Eureka

**User Service Configuration**:

**Dependency**:
```xml
<dependency>
    <groupId>org.springframework.cloud</groupId>
    <artifactId>spring-cloud-starter-netflix-eureka-client</artifactId>
</dependency>
```

**Main Class**:
```java
@SpringBootApplication
@EnableDiscoveryClient
public class UserServiceApplication {
    public static void main(String[] args) {
        SpringApplication.run(UserServiceApplication.class, args);
    }
}
```

**Configuration** (`application.properties`):
```properties
spring.application.name=user-service
server.port=8081

# Eureka client configuration
eureka.client.service-url.defaultZone=http://localhost:8761/eureka/
eureka.instance.prefer-ip-address=true
eureka.instance.lease-renewal-interval-in-seconds=30
eureka.instance.lease-expiration-duration-in-seconds=90
```

#### Step 3: Service-to-Service Communication

**Without Service Discovery (Bad)**:
```java
@Service
public class UserService {
    
    @Autowired
    private RestTemplate restTemplate;
    
    public Order getUserOrders(Long userId) {
        // Hardcoded URL
        String url = "http://localhost:8082/orders/" + userId;
        return restTemplate.getForObject(url, Order.class);
    }
}
```

**With Service Discovery (Good)**:
```java
@Configuration
public class AppConfig {
    
    @Bean
    @LoadBalanced  // Enable service discovery load balancing
    public RestTemplate restTemplate() {
        return new RestTemplate();
    }
}

@Service
public class UserService {
    
    @Autowired
    private RestTemplate restTemplate;
    
    public Order getUserOrders(Long userId) {
        // Use service name instead of hardcoded URL
        String url = "http://order-service/orders/" + userId;
        return restTemplate.getForObject(url, Order.class);
    }
}
```

### Eureka Dashboard

Access Eureka Dashboard at: `http://localhost:8761`

Shows:
-   Registered services and their instances.
-   Instance status (UP, DOWN, OUT_OF_SERVICE).
-   Renewal statistics.

---

## 4. Consul - Discovery Service

**HashiCorp Consul** is an alternative to Eureka with additional features:
-   **Service Discovery**: Like Eureka.
-   **Health Checking**: Built-in health checks.
-   **Key/Value Store**: Distributed configuration storage.
-   **Multi-Datacenter Support**: Service discovery across regions.

### Spring Cloud Consul

**Dependency**:
```xml
<dependency>
    <groupId>org.springframework.cloud</groupId>
    <artifactId>spring-cloud-starter-consul-discovery</artifactId>
</dependency>
```

**Configuration** (`application.properties`):
```properties
spring.application.name=user-service
spring.cloud.consul.host=localhost
spring.cloud.consul.port=8500
spring.cloud.consul.discovery.enabled=true
spring.cloud.consul.discovery.health-check-interval=10s
```

### Eureka vs Consul

| Feature | Eureka | Consul |
| :--- | :--- | :--- |
| **Service Discovery** | ✅ Yes | ✅ Yes |
| **Health Checks** | HTTP-based heartbeat | HTTP, TCP, Script, TTL |
| **Configuration Management** | ❌ No (needs Config Server) | ✅ Built-in KV store |
| **Multi-Datacenter** | ❌ No | ✅ Yes |
| **Complexity** | Simple | More complex |
| **Performance** | High | High |
| **Community** | Large (Netflix OSS) | Growing (HashiCorp) |

---

## 5. API Gateway

### What is an API Gateway?

An **API Gateway** is a single entry point for all client requests. It sits between clients and backend microservices.

### Responsibilities

| Responsibility | Description |
| :--- | :--- |
| **Routing** | Forward requests to appropriate microservices |
| **Authentication** | Verify user identity before forwarding requests |
| **Authorization** | Check if user has permission to access resources |
| **Rate Limiting** | Prevent abuse by limiting requests per user/IP |
| **SSL Termination** | Handle HTTPS encryption/decryption |
| **Load Balancing** | Distribute requests across service instances |
| **Request/Response Transformation** | Modify headers, bodies, etc. |
| **Caching** | Cache responses to reduce backend load |
| **Logging & Monitoring** | Centralized request logging |
| **Circuit Breaker** | Fail fast when downstream services are down |

### Architecture

```
┌──────────┐        ┌───────────────┐        ┌──────────────┐
│  Client  │───────▶│  API Gateway  │───────▶│ User Service │
│ (Mobile) │        │               │        └──────────────┘
└──────────┘        │  Routes:      │        ┌──────────────┐
                    │  /users/**    │───────▶│Order Service │
┌──────────┐        │  /orders/**   │        └──────────────┘
│  Client  │───────▶│  /products/** │        ┌──────────────┐
│   (Web)  │        │               │───────▶│Product Svc   │
└──────────┘        └───────────────┘        └──────────────┘
```

### Spring Cloud Gateway

**Spring Cloud Gateway** is a performant, non-blocking API Gateway built on Spring WebFlux.

#### Setting Up Spring Cloud Gateway

**Dependency** (`pom.xml`):
```xml
<dependency>
    <groupId>org.springframework.cloud</groupId>
    <artifactId>spring-cloud-starter-gateway</artifactId>
</dependency>
<dependency>
    <groupId>org.springframework.cloud</groupId>
    <artifactId>spring-cloud-starter-netflix-eureka-client</artifactId>
</dependency>
```

**Configuration** (`application.yml`):
```yaml
spring:
  application:
    name: api-gateway
  cloud:
    gateway:
      routes:
        - id: user-service-route
          uri: lb://user-service  # lb = load-balanced via Eureka
          predicates:
            - Path=/users/**
          filters:
            - RewritePath=/users/(?<segment>.*), /${segment}
        
        - id: order-service-route
          uri: lb://order-service
          predicates:
            - Path=/orders/**
        
        - id: product-service-route
          uri: lb://product-service
          predicates:
            - Path=/products/**

      discovery:
        locator:
          enabled: true  # Auto-create routes for all services in Eureka

eureka:
  client:
    service-url:
      defaultZone: http://localhost:8761/eureka/

server:
  port: 8080
```

#### Custom Filters

```java
@Component
public class AuthenticationFilter implements GlobalFilter, Ordered {
    
    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
        // Get request
        ServerHttpRequest request = exchange.getRequest();
        
        // Check for auth token
        if (!request.getHeaders().containsKey("Authorization")) {
            exchange.getResponse().setStatusCode(HttpStatus.UNAUTHORIZED);
            return exchange.getResponse().setComplete();
        }
        
        // Continue with filter chain
        return chain.filter(exchange);
    }
    
    @Override
    public int getOrder() {
        return -1;  // Execute first
    }
}
```

---

## 6. Feign Client

**Feign** is a declarative HTTP client that makes writing web service clients easier.

### Problem: RestTemplate is Verbose

```java
@Service
public class UserService {
    
    @Autowired
    private RestTemplate restTemplate;
    
    public Order getOrder(Long orderId) {
        String url = "http://order-service/orders/" + orderId;
        return restTemplate.getForObject(url, Order.class);
    }
    
    public Order createOrder(Order order) {
        String url = "http://order-service/orders";
        return restTemplate.postForObject(url, order, Order.class);
    }
}
```

### Solution: Feign Client

**Dependency**:
```xml
<dependency>
    <groupId>org.springframework.cloud</groupId>
    <artifactId>spring-cloud-starter-openfeign</artifactId>
</dependency>
```

**Enable Feign**:
```java
@SpringBootApplication
@EnableFeignClients
public class UserServiceApplication {
    public static void main(String[] args) {
        SpringApplication.run(UserServiceApplication.class, args);
    }
}
```

**Feign Client Interface**:
```java
@FeignClient(name = "order-service")
public interface OrderServiceClient {
    
    @GetMapping("/orders/{id}")
    Order getOrder(@PathVariable("id") Long orderId);
    
    @PostMapping("/orders")
    Order createOrder(@RequestBody Order order);
    
    @GetMapping("/orders/user/{userId}")
    List<Order> getOrdersByUserId(@PathVariable("userId") Long userId);
}
```

**Usage**:
```java
@Service
public class UserService {
    
    @Autowired
    private OrderServiceClient orderServiceClient;
    
    public UserOrdersDTO getUserWithOrders(Long userId) {
        User user = userRepo.findById(userId).orElseThrow();
        List<Order> orders = orderServiceClient.getOrdersByUserId(userId);
        
        return new UserOrdersDTO(user, orders);
    }
}
```

### Feign Configuration

```java
@Configuration
public class FeignConfig {
    
    @Bean
    public Logger.Level feignLoggerLevel() {
        return Logger.Level.FULL;  // Log requests and responses
    }
    
    @Bean
    public Retryer feignRetryer() {
        return new Retryer.Default(100, 1000, 3);  // 3 retries
    }
}
```

---

## 7. Load Balancing

**Load Balancing** distributes incoming requests across multiple service instances.

### Types of Load Balancing

| Type | Description | Example |
| :--- | :--- | :--- |
| **Server-Side** | External load balancer (hardware/software) | Nginx, AWS ELB, HAProxy |
| **Client-Side** | Client chooses which instance to call | Spring Cloud LoadBalancer, Ribbon |

### Spring Cloud LoadBalancer

**Enabled automatically** when using `@LoadBalanced` with RestTemplate or Feign.

```java
@Configuration
public class AppConfig {
    
    @Bean
    @LoadBalanced  // Enables client-side load balancing
    public RestTemplate restTemplate() {
        return new RestTemplate();
    }
}
```

**How It Works**:
1.  Client asks Eureka for all instances of `order-service`.
2.  Eureka returns: `[192.168.1.5:8082, 192.168.1.6:8082, 192.168.1.7:8082]`.
3.  LoadBalancer picks one instance (round-robin, random, etc.).
4.  Request is sent to chosen instance.

### Load Balancing Strategies

```java
@Configuration
public class LoadBalancerConfig {
    
    @Bean
    public ReactorLoadBalancer<ServiceInstance> randomLoadBalancer(
            Environment environment,
            LoadBalancerClientFactory clientFactory) {
        
        String serviceId = environment.getProperty(LoadBalancerClientFactory.PROPERTY_NAME);
        
        return new RandomLoadBalancer(
            clientFactory.getLazyProvider(serviceId, ServiceInstanceListSupplier.class),
            serviceId
        );
    }
}
```

---

## 8. Config Server

**Spring Cloud Config Server** provides centralized configuration management for distributed systems.

### The Problem

In microservices:
-   Each service has its own configuration (`application.properties`).
-   Changing configuration requires redeployment.
-   Hard to manage configurations across environments (dev, staging, prod).

### The Solution: Config Server

-   **Centralized**: Store all configurations in a central location (Git repo).
-   **Environment-Specific**: Different configs for dev, staging, prod.
-   **Dynamic Refresh**: Update configuration without restarting services.

### Architecture

```
┌──────────────┐
│ Git Repository│
│              │
│ /config      │
│  ├── user-service.yml
│  ├── order-service.yml
│  └── product-service-dev.yml
└──────┬───────┘
       │ Pull Configs
       ▼
┌──────────────┐
│ Config Server│
│ :8888        │
└──────┬───────┘
       │ Request Configs
       ▼
┌──────────────┐
│ User Service │
│ Order Service│
│ Product Svc  │
└──────────────┘
```

### Setting Up Config Server

**Dependency**:
```xml
<dependency>
    <groupId>org.springframework.cloud</groupId>
    <artifactId>spring-cloud-config-server</artifactId>
</dependency>
```

**Main Class**:
```java
@SpringBootApplication
@EnableConfigServer
public class ConfigServerApplication {
    public static void main(String[] args) {
        SpringApplication.run(ConfigServerApplication.class, args);
    }
}
```

**Configuration** (`application.properties`):
```properties
spring.application.name=config-server
server.port=8888

spring.cloud.config.server.git.uri=https://github.com/yourorg/config-repo
spring.cloud.config.server.git.clone-on-start=true
spring.cloud.config.server.git.default-label=main
```

### Config Client Setup

**Dependency**:
```xml
<dependency>
    <groupId>org.springframework.cloud</groupId>
    <artifactId>spring-cloud-starter-config</artifactId>
</dependency>
```

**Configuration** (`application.properties`):
```properties
spring.application.name=user-service
spring.cloud.config.uri=http://localhost:8888
spring.profiles.active=dev
```

**Git Repository Structure**:
```
config-repo/
├── user-service.yml           # Common config
├── user-service-dev.yml       # Dev-specific
├── user-service-prod.yml      # Prod-specific
└── order-service.yml
```

**Example Config File** (`user-service-dev.yml`):
```yaml
server:
  port: 8081

spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/userdb_dev
    username: dev_user
    password: dev_password

eureka:
  client:
    service-url:
      defaultZone: http://localhost:8761/eureka/
```

### Dynamic Configuration Refresh

**Add Actuator**:
```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-actuator</artifactId>
</dependency>
```

**Enable Refresh Endpoint**:
```properties
management.endpoints.web.exposure.include=refresh
```

**Annotate Configuration Classes**:
```java
@RestController
@RefreshScope  // Allows dynamic refresh
public class ConfigController {
    
    @Value("${custom.message}")
    private String message;
    
    @GetMapping("/message")
    public String getMessage() {
        return message;
    }
}
```

**Trigger Refresh**:
```bash
curl -X POST http://localhost:8081/actuator/refresh
```

---

## 9. Spring Cloud Circuit Breaker

The **Circuit Breaker** pattern prevents cascading failures in distributed systems.

### The Problem: Cascading Failures

```
Service A ─calls─▶ Service B ─calls─▶ Service C (DOWN)
                                       ⚠️ Slow/Timeout
                        ◀─waits─
         ◀─waits─
⚠️ Service A becomes unresponsive waiting for B
```

### The Solution: Circuit Breaker

**States**:
1.  **Closed**: Normal operation. Requests pass through.
2.  **Open**: Too many failures. Reject requests immediately (fail fast).
3.  **Half-Open**: After timeout, allow limited requests to test if service recovered.

```
    Success
  ┌─────────┐
  │         ▼
┌──────────────┐
│    CLOSED    │ ───Failure threshold reached───▶ ┌──────────────┐
│  (Normal)    │                                  │     OPEN     │
└──────────────┘                                  │ (Fail Fast)  │
  ▲                                               └──────┬───────┘
  │                                                      │ Timeout
  │ Success                                              ▼
  │                                               ┌──────────────┐
  └──────────── Test requests succeed ────────── │  HALF-OPEN   │
                                                  │ (Testing)    │
                                                  └──────────────┘
```

### Resilience4j Circuit Breaker

**Dependency**:
```xml
<dependency>
    <groupId>org.springframework.cloud</groupId>
    <artifactId>spring-cloud-starter-circuitbreaker-resilience4j</artifactId>
</dependency>
```

**Configuration** (`application.yml`):
```yaml
resilience4j:
  circuitbreaker:
    instances:
      orderService:
        registerHealthIndicator: true
        slidingWindowSize: 10
        minimumNumberOfCalls: 5
        permittedNumberOfCallsInHalfOpenState: 3
        automaticTransitionFromOpenToHalfOpenEnabled: true
        waitDurationInOpenState: 10s
        failureRateThreshold: 50
        eventConsumerBufferSize: 10
```

**Usage**:
```java
@Service
public class UserService {
    
    @Autowired
    private OrderServiceClient orderServiceClient;
    
    @CircuitBreaker(name = "orderService", fallbackMethod = "getOrdersFallback")
    public List<Order> getUserOrders(Long userId) {
        return orderServiceClient.getOrdersByUserId(userId);
    }
    
    // Fallback method when circuit is open
    public List<Order> getOrdersFallback(Long userId, Exception ex) {
        logger.warn("Circuit breaker activated for user {}: {}", userId, ex.getMessage());
        return Collections.emptyList();  // Return safe default
    }
}
```

---

## 10. Distributed Tracing

In microservices, a single request may flow through multiple services. **Distributed Tracing** helps track requests across services.

### The Problem

```
Client ──▶ API Gateway ──▶ User Service ──▶ Order Service ──▶ Payment Service
                                                ⚠️ Error here
```

**Question**: Which service caused the error? How long did each hop take?

### The Solution: Trace ID and Span ID

-   **Trace ID**: Unique ID assigned to the entire request flow (same across all services).
-   **Span ID**: Unique ID for each hop/service in the flow.

```
Trace ID: abc123
├── Span 1: API Gateway (20ms)
├── Span 2: User Service (50ms)
├── Span 3: Order Service (100ms)
└── Span 4: Payment Service (ERROR)
```

### Spring Cloud Sleuth (Deprecated) vs Micrometer Tracing

-   **Spring Cloud Sleuth**: Legacy (deprecated in favor of Micrometer).
-   **Micrometer Tracing**: Modern, integrated with Spring Boot 3+.

### Setting Up Micrometer Tracing

**Dependencies**:
```xml
<dependency>
    <groupId>io.micrometer</groupId>
    <artifactId>micrometer-tracing-bridge-brave</artifactId>
</dependency>
<dependency>
    <groupId>io.zipkin.reporter2</groupId>
    <artifactId>zipkin-reporter-brave</artifactId>
</dependency>
```

**Configuration** (`application.properties`):
```properties
management.tracing.sampling.probability=1.0  # 100% sampling (for dev)
management.zipkin.tracing.endpoint=http://localhost:9411/api/v2/spans
```

**Start Zipkin**:
```bash
docker run -d -p 9411:9411 openzipkin/zipkin
```

**Access Zipkin UI**: `http://localhost:9411`

### Viewing Traces

1.  Make a request to your API.
2.  Open Zipkin UI.
3.  Search for traces.
4.  Click a trace to see:
    -   Services involved.
    -   Time spent in each service.
    -   Error details.

---

## 11. Monitoring Tools

### Key Metrics to Monitor

| Metric Category | Examples |
| :--- | :--- |
| **Application** | Request rate, error rate, response time |
| **JVM** | Heap usage, GC pauses, thread count |
| **Service Discovery** | Registered instances, health status |
| **Circuit Breaker** | Circuit state, failure rate |
| **Database** | Connection pool, query time |

### Monitoring Stack

#### 1. Spring Boot Actuator
Exposes application metrics and health endpoints.

**Dependency**:
```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-actuator</artifactId>
</dependency>
```

**Configuration**:
```properties
management.endpoints.web.exposure.include=*
management.endpoint.health.show-details=always
```

**Endpoints**:
-   `/actuator/health`: Application health.
-   `/actuator/metrics`: Available metrics.
-   `/actuator/metrics/http.server.requests`: HTTP request metrics.

#### 2. Prometheus
Collects and stores metrics.

**Dependency**:
```xml
<dependency>
    <groupId>io.micrometer</groupId>
    <artifactId>micrometer-registry-prometheus</artifactId>
</dependency>
```

**Prometheus Config** (`prometheus.yml`):
```yaml
scrape_configs:
  - job_name: 'spring-boot'
    metrics_path: '/actuator/prometheus'
    static_configs:
      - targets: ['localhost:8081', 'localhost:8082', 'localhost:8083']
```

#### 3. Grafana
Visualizes metrics from Prometheus.

**Dashboards**:
-   JVM (Micrometer): Dashboard ID 4701
-   Spring Boot Statistics: Dashboard ID 6756

#### 4. ELK Stack (Elasticsearch, Logstash, Kibana)
Centralized logging.

-   **Logstash**: Collects logs from services.
-   **Elasticsearch**: Stores and indexes logs.
-   **Kibana**: Visualizes and searches logs.

---

## 12. Best Practices

### Service Discovery
1.  **Health checks**: Configure proper health check intervals.
2.  **Graceful shutdown**: Deregister before shutting down.
3.  **Metadata**: Use instance metadata for routing decisions.

### API Gateway
1.  **Rate limiting**: Protect backend services from abuse.
2.  **Authentication**: Centralize auth at the gateway.
3.  **Caching**: Cache responses to reduce backend load.
4.  **Timeouts**: Set appropriate timeouts to prevent hanging requests.

### Circuit Breaker
1.  **Fallback methods**: Always provide meaningful fallbacks.
2.  **Monitoring**: Track circuit state and failure rates.
3.  **Tuning**: Adjust thresholds based on service behavior.

### Configuration
1.  **Externalize**: Never hardcode env-specific values.
2.  **Encryption**: Encrypt sensitive values in config repos.
3.  **Versioning**: Use Git for configuration versioning.

### Monitoring
1.  **Centralized**: Use centralized logging and metrics.
2.  **Alerts**: Set up alerts for critical metrics.
3.  **Distributed tracing**: Always enable tracing in production.
