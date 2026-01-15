# Week 6 - Tuesday: Annotation-Based Configuration & Spring Boot Basics

## 1. Annotation-Based Configuration

### Overview

**Annotation-Based Configuration** replaces XML with annotations directly on Java classes. This is the most common approach in modern Spring applications.

### Evolution of Spring Configuration

```
XML Config (2002) → Java Config (2009) → Annotation Config (2014+)
                                              ↓
                                         Spring Boot
```

---

## 2. Component Scanning

### What is Component Scanning?

**Component Scanning** automatically detects and registers annotated classes as Spring beans.

### Enabling Component Scanning

**Spring Boot (Automatic)**:
```java
@SpringBootApplication  // Includes @ComponentScan
public class Application {
    public static void main(String[] args) {
        SpringApplication.run(Application.class, args);
    }
}
```

**Manual Configuration**:
```java
@Configuration
@ComponentScan(basePackages = "com.example")
public class AppConfig {
    // Scans com.example and all sub-packages
}

// Multiple packages
@ComponentScan(basePackages = {"com.example.service", "com.example.repository"})

// Type-safe alternative
@ComponentScan(basePackageClasses = {UserService.class, ProductService.class})
```

### Excluding Components

```java
@ComponentScan(
    basePackages = "com.example",
    excludeFilters = {
        @ComponentScan.Filter(type = FilterType.ANNOTATION, classes = Deprecated.class),
        @ComponentScan.Filter(type = FilterType.REGEX, pattern = ".*Test.*")
    }
)
```

---

## 3. Stereotype Annotations

Spring provides specialized annotations called **Stereotype Annotations** that indicate a class's role.

### @Component

Generic Spring-managed component.

```java
@Component
public class EmailValidator {
    public boolean isValid(String email) {
        return email != null && email.contains("@");
    }
}
```

### @Service

Specialized @Component for business logic/service layer.

```java
@Service
public class UserService {
    private final UserRepository userRepository;
    
    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }
    
    public User findById(Long id) {
        return userRepository.findById(id)
            .orElseThrow(() -> new UserNotFoundException(id));
    }
}
```

### @Repository

Specialized @Component for data access layer. Adds exception translation.

```java
@Repository
public class UserRepositoryImpl implements UserRepository {
    
    @PersistenceContext
    private EntityManager entityManager;
    
    @Override
    public User findById(Long id) {
        return entityManager.find(User.class, id);
    }
    
    // DataAccessException translation happens automatically
}
```

**Exception Translation**:
- Converts technology-specific exceptions (JPA, JDBC, Hibernate)
- To Spring's DataAccessException hierarchy
- Consistent exception handling regardless of persistence technology

### @Controller

Specialized @Component for web layer (Spring MVC).

```java
@Controller
public class HomeController {
    
    @GetMapping("/")
    public String home(Model model) {
        model.addAttribute("message", "Welcome!");
        return "home";  // Returns view name
    }
}
```

### @RestController

Combines @Controller + @ResponseBody for REST APIs.

```java
@RestController
@RequestMapping("/api/users")
public class UserController {
    
    private final UserService userService;
    
    public UserController(UserService userService) {
        this.userService = userService;
    }
    
    @GetMapping("/{id}")
    public User getUser(@PathVariable Long id) {
        return userService.findById(id);  // Returns JSON directly
    }
}
```

### @Configuration

Declares a class as a source of bean definitions.

```java
@Configuration
public class SecurityConfig {
    
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
    
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        return http.build();
    }
}
```

### Stereotype Comparison Table

| Annotation | Layer | Purpose | Special Behavior |
|------------|-------|---------|------------------|
| `@Component` | Any | Generic component | Base annotation |
| `@Service` | Service | Business logic | None (semantic) |
| `@Repository` | DAO | Data access | Exception translation |
| `@Controller` | Web | MVC controllers | View resolution |
| `@RestController` | Web | REST APIs | JSON serialization |
| `@Configuration` | Config | Bean definitions | Proxy for @Bean |

---

## 4. Spring Boot Overview

### What is Spring Boot?

**Spring Boot** makes it easy to create stand-alone, production-grade Spring applications.

### Core Principles

| Principle | Description |
|-----------|-------------|
| **Opinionated Defaults** | Sensible defaults that work out of the box |
| **Starter Dependencies** | Pre-configured dependency bundles |
| **Auto-Configuration** | Automatically configures based on classpath |
| **Embedded Server** | No need for external Tomcat/Jetty |
| **Production Ready** | Metrics, health checks, externalized config |

### Spring Boot vs Spring Framework

| Aspect | Spring Framework | Spring Boot |
|--------|-----------------|-------------|
| **Setup** | Manual configuration | Auto-configuration |
| **Server** | External (WAR deploy) | Embedded (JAR) |
| **Dependencies** | Manual management | Starters |
| **Configuration** | XML or Java | Properties/YAML |
| **Startup** | Complex | Simple main() |

---

## 5. Using Spring Initializr

### What is Spring Initializr?

A web-based tool to generate Spring Boot project structure.

**URL**: [https://start.spring.io](https://start.spring.io)

### Steps to Create a Project

1. **Select Project Settings**:
   - Project: Maven or Gradle
   - Language: Java, Kotlin, or Groovy
   - Spring Boot Version: Latest stable

2. **Configure Metadata**:
   - Group: `com.example`
   - Artifact: `myapp`
   - Name: `myapp`
   - Package name: `com.example.myapp`
   - Packaging: Jar (recommended)
   - Java Version: 17 or 21

3. **Add Dependencies**:
   - Spring Web
   - Spring Data JPA
   - PostgreSQL Driver
   - Spring Boot DevTools

4. **Generate**: Download ZIP, extract, and import into IDE

### Generated Project Structure

```
myapp/
├── src/
│   ├── main/
│   │   ├── java/
│   │   │   └── com/example/myapp/
│   │   │       └── MyappApplication.java
│   │   └── resources/
│   │       ├── application.properties
│   │       ├── static/
│   │       └── templates/
│   └── test/
│       └── java/
│           └── com/example/myapp/
│               └── MyappApplicationTests.java
├── pom.xml (or build.gradle)
└── mvnw (Maven wrapper)
```

---

## 6. Auto-Configuration

### What is Auto-Configuration?

Spring Boot automatically configures your application based on:
- Dependencies on the classpath
- Defined beans
- Various property settings

### How It Works

```
Dependencies on Classpath
         │
         ▼
@EnableAutoConfiguration (in @SpringBootApplication)
         │
         ▼
spring.factories files scanned
         │
         ▼
Conditional checks (@ConditionalOn...)
         │
         ▼
Beans created automatically
```

### Example: DataSource Auto-Configuration

**With `spring-boot-starter-data-jpa` and PostgreSQL on classpath:**

```properties
# application.properties
spring.datasource.url=jdbc:postgresql://localhost:5432/mydb
spring.datasource.username=postgres
spring.datasource.password=secret
```

Spring Boot automatically:
1. Creates a `DataSource` bean
2. Configures Hibernate as JPA provider
3. Sets up connection pooling (HikariCP)
4. Configures EntityManagerFactory

### Conditional Annotations

| Annotation | Condition |
|------------|-----------|
| `@ConditionalOnClass` | Class exists on classpath |
| `@ConditionalOnBean` | Bean exists in context |
| `@ConditionalOnMissingBean` | Bean does NOT exist |
| `@ConditionalOnProperty` | Property has specific value |
| `@ConditionalOnWebApplication` | Running as web app |

### Disabling Auto-Configuration

```java
@SpringBootApplication(exclude = {
    DataSourceAutoConfiguration.class,
    HibernateJpaAutoConfiguration.class
})
public class Application { }
```

---

## 7. Common Spring Boot Starters

### What are Starters?

**Starters** are dependency descriptors that include everything needed for a feature.

### Essential Starters

| Starter | Purpose | Key Dependencies |
|---------|---------|------------------|
| `spring-boot-starter` | Core (always included) | spring-core, spring-context, logging |
| `spring-boot-starter-web` | Web applications | spring-webmvc, embedded Tomcat, Jackson |
| `spring-boot-starter-data-jpa` | JPA/Hibernate | spring-data-jpa, hibernate, HikariCP |
| `spring-boot-starter-security` | Security | spring-security-web, spring-security-config |
| `spring-boot-starter-test` | Testing | JUnit 5, Mockito, AssertJ, Spring Test |
| `spring-boot-starter-validation` | Bean Validation | hibernate-validator |
| `spring-boot-starter-actuator` | Production monitoring | Metrics, health checks |

### Example: pom.xml with Starters

```xml
<dependencies>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-web</artifactId>
    </dependency>
    
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-data-jpa</artifactId>
    </dependency>
    
    <dependency>
        <groupId>org.postgresql</groupId>
        <artifactId>postgresql</artifactId>
        <scope>runtime</scope>
    </dependency>
    
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-test</artifactId>
        <scope>test</scope>
    </dependency>
</dependencies>
```

---

## 8. Spring Boot DevTools

### What is DevTools?

**DevTools** provides developer-friendly features for faster development.

### Enable DevTools

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-devtools</artifactId>
    <scope>runtime</scope>
    <optional>true</optional>
</dependency>
```

### Key Features

#### 1. Automatic Restart

When files change, the application automatically restarts.

```
Class file changed
       │
       ▼
Application restarts (~2-3 seconds)
       │
       ▼
Changes visible immediately
```

**Faster than full restart**: Uses two classloaders:
- Base classloader: Third-party JARs (unchanged)
- Restart classloader: Your classes (reloaded)

#### 2. LiveReload

Automatically refreshes browser when resources change.

```
HTML/CSS/JS file changed
       │
       ▼
Browser automatically refreshes
```

**Requires**: LiveReload browser extension

#### 3. Property Defaults

Development-friendly defaults:
- Template caching disabled
- Thymeleaf debug mode enabled
- H2 console enabled

### DevTools Configuration

```properties
# application.properties

# Trigger files that cause restart
spring.devtools.restart.trigger-file=.reloadtrigger

# Exclude paths from restart monitoring
spring.devtools.restart.exclude=static/**,public/**

# Disable restart (if needed)
spring.devtools.restart.enabled=false
```

---

## 9. Spring Environments & Profiles

### What are Profiles?

**Profiles** allow different configurations for different environments.

### Common Profiles

| Profile | Purpose |
|---------|---------|
| `dev` | Local development |
| `test` | Testing |
| `staging` | Pre-production testing |
| `prod` | Production |

### Defining Profile-Specific Properties

**application-dev.properties**:
```properties
spring.datasource.url=jdbc:h2:mem:testdb
spring.jpa.show-sql=true
logging.level.com.example=DEBUG
```

**application-prod.properties**:
```properties
spring.datasource.url=jdbc:postgresql://prod-db:5432/myapp
spring.jpa.show-sql=false
logging.level.com.example=INFO
```

### Activating Profiles

```properties
# application.properties
spring.profiles.active=dev
```

**Command line**:
```bash
java -jar myapp.jar --spring.profiles.active=prod
```

**Environment variable**:
```bash
export SPRING_PROFILES_ACTIVE=prod
```

### Profile-Specific Beans

```java
@Configuration
public class DataSourceConfig {
    
    @Bean
    @Profile("dev")
    public DataSource devDataSource() {
        return new EmbeddedDatabaseBuilder()
            .setType(EmbeddedDatabaseType.H2)
            .build();
    }
    
    @Bean
    @Profile("prod")
    public DataSource prodDataSource() {
        HikariDataSource ds = new HikariDataSource();
        ds.setJdbcUrl("jdbc:postgresql://prod-db:5432/myapp");
        return ds;
    }
}
```

---

## 10. Spring Boot Actuator

### What is Actuator?

**Actuator** exposes production-ready endpoints for monitoring and management.

### Enable Actuator

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-actuator</artifactId>
</dependency>
```

### Built-In Actuator Endpoints

| Endpoint | Purpose | Default |
|----------|---------|---------|
| `/actuator/health` | Application health status | Enabled |
| `/actuator/info` | Application information | Enabled |
| `/actuator/metrics` | Application metrics | Disabled |
| `/actuator/env` | Environment properties | Disabled |
| `/actuator/loggers` | Logger configuration | Disabled |
| `/actuator/beans` | All beans in context | Disabled |
| `/actuator/mappings` | All @RequestMapping paths | Disabled |
| `/actuator/heapdump` | Heap dump | Disabled |
| `/actuator/threaddump` | Thread dump | Disabled |

### Enabling Endpoints

```properties
# Expose all endpoints
management.endpoints.web.exposure.include=*

# Or specific endpoints
management.endpoints.web.exposure.include=health,info,metrics

# Show full health details
management.endpoint.health.show-details=always
```

### Health Endpoint Response

```json
{
  "status": "UP",
  "components": {
    "db": {
      "status": "UP",
      "details": {
        "database": "PostgreSQL",
        "validationQuery": "isValid()"
      }
    },
    "diskSpace": {
      "status": "UP",
      "details": {
        "total": 1000000000,
        "free": 500000000,
        "threshold": 10485760
      }
    }
  }
}
```

### Custom Health Indicator

```java
@Component
public class CustomHealthIndicator implements HealthIndicator {
    
    @Override
    public Health health() {
        boolean serviceUp = checkExternalService();
        
        if (serviceUp) {
            return Health.up()
                .withDetail("service", "Available")
                .build();
        } else {
            return Health.down()
                .withDetail("service", "Unavailable")
                .build();
        }
    }
}
```

### Info Endpoint

```properties
# application.properties
info.app.name=My Application
info.app.version=1.0.0
info.app.description=A Spring Boot application
```

Response:
```json
{
  "app": {
    "name": "My Application",
    "version": "1.0.0",
    "description": "A Spring Boot application"
  }
}
```

---

## 11. Application Properties

### Configuration Methods

| Method | File | Format |
|--------|------|--------|
| Properties | `application.properties` | `key=value` |
| YAML | `application.yml` | Hierarchical |

### Properties Format

```properties
# Server configuration
server.port=8081
server.servlet.context-path=/api

# Database
spring.datasource.url=jdbc:postgresql://localhost:5432/mydb
spring.datasource.username=postgres
spring.datasource.password=secret

# JPA
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true

# Logging
logging.level.root=INFO
logging.level.com.example=DEBUG
```

### YAML Format

```yaml
server:
  port: 8081
  servlet:
    context-path: /api

spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/mydb
    username: postgres
    password: secret
  jpa:
    hibernate:
      ddl-auto: update
    show-sql: true

logging:
  level:
    root: INFO
    com.example: DEBUG
```

### Injecting Properties

```java
@Component
public class AppConfig {
    
    @Value("${server.port}")
    private int serverPort;
    
    @Value("${app.name:DefaultApp}")  // With default value
    private String appName;
    
    @Value("${app.features}")  // comma-separated -> List
    private List<String> features;
}
```

### @ConfigurationProperties (Type-Safe)

```java
@Configuration
@ConfigurationProperties(prefix = "app")
public class AppProperties {
    private String name;
    private String version;
    private List<String> features;
    
    // Getters and setters
}
```

```yaml
# application.yml
app:
  name: My App
  version: 1.0.0
  features:
    - feature1
    - feature2
```

---

## Summary

Key concepts covered today:

| Topic | Key Points |
|-------|------------|
| **Component Scanning** | Auto-detect annotated classes as beans |
| **Stereotype Annotations** | @Component, @Service, @Repository, @Controller |
| **Spring Boot** | Simplified Spring with sensible defaults |
| **Spring Initializr** | Web tool to generate projects |
| **Auto-Configuration** | Automatic setup based on classpath |
| **Starters** | Pre-packaged dependency bundles |
| **DevTools** | Fast restarts, LiveReload |
| **Profiles** | Environment-specific configuration |
| **Actuator** | Production monitoring endpoints |

**Tomorrow**: Spring MVC, Controllers, REST APIs, and Swagger documentation!
