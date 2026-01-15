# Week 6 - Monday: Introduction to Spring & Dependency Injection

## Week 6 Overview

This week covers the **Spring Framework ecosystem**:
- **Monday-Tuesday**: Spring Core - DI, IoC, Beans, Lifecycle
- **Wednesday**: Spring Boot - Auto-Configuration, Starters, Actuator
- **Thursday**: Spring MVC - Controllers, REST APIs, Swagger
- **Friday**: Hibernate & JPA - ORM, Queries, Caching

---

## 1. Introduction to Spring Framework

### What is Spring?

**Spring** is a comprehensive framework for building enterprise Java applications. It provides infrastructure support so developers can focus on business logic.

### Spring History

| Year | Event |
|------|-------|
| 2002 | Rod Johnson publishes "Expert One-on-One J2EE Design and Development" |
| 2003 | Spring Framework 1.0 released |
| 2014 | Spring Boot 1.0 released |
| 2017 | Spring 5.0 with reactive programming support |
| 2022 | Spring 6.0 with Jakarta EE 9+ support |

### The Spring Ecosystem

```
┌────────────────────────────────────────────────────────┐
│                    Spring Ecosystem                     │
├──────────────────┬────────────────┬────────────────────┤
│  Spring Core     │  Spring Boot   │  Spring Data       │
│  (IoC, DI, AOP)  │  (Rapid Dev)   │  (Data Access)     │
├──────────────────┼────────────────┼────────────────────┤
│  Spring MVC      │  Spring Security│  Spring Cloud     │
│  (Web Layer)     │  (Auth/Authz)  │  (Microservices)   │
├──────────────────┼────────────────┼────────────────────┤
│  Spring Batch    │  Spring Integration │  Spring WebFlux│
│  (Batch Jobs)    │  (EAI Patterns)│  (Reactive)        │
└──────────────────┴────────────────┴────────────────────┘
```

### Why Spring?

| Problem | Spring Solution |
|---------|-----------------|
| Complex EJB configuration | Lightweight POJO-based programming |
| Tight coupling between components | Dependency Injection (DI) |
| Boilerplate code | Annotations and auto-configuration |
| Difficult testing | Loose coupling enables easy mocking |
| Manual resource management | Declarative transaction management |

---

## 2. Overview of Dependency Injection

### What is Dependency Injection?

**Dependency Injection (DI)** is a design pattern where objects receive their dependencies from an external source rather than creating them internally.

### Without DI (Tightly Coupled)

```java
public class OrderService {
    // Service creates its own dependencies - tight coupling!
    private OrderRepository repository = new OrderRepository();
    private EmailService emailService = new EmailService();
    
    public void createOrder(Order order) {
        repository.save(order);
        emailService.sendConfirmation(order);
    }
}
```

**Problems**:
- Cannot swap implementations (e.g., for testing)
- Hard to unit test (can't mock dependencies)
- Changes to dependencies require changes to service
- Difficult to reuse components

### With DI (Loosely Coupled)

```java
public class OrderService {
    // Dependencies are injected from outside
    private final OrderRepository repository;
    private final EmailService emailService;
    
    // Constructor injection
    public OrderService(OrderRepository repository, EmailService emailService) {
        this.repository = repository;
        this.emailService = emailService;
    }
    
    public void createOrder(Order order) {
        repository.save(order);
        emailService.sendConfirmation(order);
    }
}
```

**Benefits**:
- Easy to swap implementations
- Simple to mock for testing
- Components are reusable
- Clear dependencies (visible in constructor)

---

## 3. Types of Dependency Injection

### 1. Constructor Injection (Recommended)

Dependencies provided through the constructor.

```java
@Service
public class UserService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    
    // @Autowired is optional with single constructor (Spring 4.3+)
    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }
    
    public User createUser(String username, String password) {
        User user = new User(username, passwordEncoder.encode(password));
        return userRepository.save(user);
    }
}
```

**Advantages**:
- Dependencies are required (enforced by compiler)
- Object is always in valid state after construction
- Dependencies can be `final` (immutable)
- Easy to test - just pass mock objects to constructor
- Clear visibility of all dependencies

### 2. Setter Injection

Dependencies provided through setter methods.

```java
@Service
public class NotificationService {
    private EmailService emailService;
    private SMSService smsService;  // Optional dependency
    
    @Autowired
    public void setEmailService(EmailService emailService) {
        this.emailService = emailService;
    }
    
    @Autowired(required = false)  // Optional dependency
    public void setSmsService(SMSService smsService) {
        this.smsService = smsService;
    }
    
    public void notify(User user, String message) {
        emailService.send(user.getEmail(), message);
        if (smsService != null) {
            smsService.send(user.getPhone(), message);
        }
    }
}
```

**Advantages**:
- Supports optional dependencies
- Can change dependencies after construction
- Useful for circular dependencies (use with caution)

**Disadvantages**:
- Object may be in invalid state if setter not called
- Dependencies can be changed at any time (mutability)

### 3. Field Injection (Not Recommended)

Dependencies injected directly into fields using reflection.

```java
@Service
public class ProductService {
    @Autowired
    private ProductRepository productRepository;  // Injected via reflection
    
    @Autowired
    private CategoryService categoryService;
    
    public Product createProduct(ProductDTO dto) {
        // Use injected dependencies
        Category category = categoryService.findById(dto.getCategoryId());
        Product product = new Product(dto.getName(), category);
        return productRepository.save(product);
    }
}
```

**Why It's Not Recommended**:
- Cannot use constructor for dependency validation
- Difficult to test without Spring context
- Hidden dependencies (not visible in constructor)
- Cannot make dependencies `final`
- Breaks encapsulation (uses reflection)

### Comparison Table

| Aspect | Constructor | Setter | Field |
|--------|-------------|--------|-------|
| **Recommended?** | Yes | Sometimes | No |
| **Required Dependencies** | Enforced | Optional | Hidden |
| **Immutability** | Supports `final` | No | No |
| **Testability** | Easy | Medium | Hard |
| **Circular Dependencies** | Fails | Possible | Possible |
| **Visibility** | Clear | Moderate | Hidden |

---

## 4. Injection Using XML-Based Configuration

### Traditional XML Configuration (Legacy)

**applicationContext.xml**:
```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xsi:schemaLocation="http://www.springframework.org/schema/beans
       http://www.springframework.org/schema/beans/spring-beans.xsd">
    
    <!-- Define a simple bean -->
    <bean id="userRepository" class="com.example.repository.UserRepository"/>
    
    <!-- Constructor Injection -->
    <bean id="userService" class="com.example.service.UserService">
        <constructor-arg ref="userRepository"/>
        <constructor-arg ref="passwordEncoder"/>
    </bean>
    
    <!-- Setter Injection -->
    <bean id="notificationService" class="com.example.service.NotificationService">
        <property name="emailService" ref="emailService"/>
        <property name="smsService" ref="smsService"/>
    </bean>
    
    <!-- Bean with primitive values -->
    <bean id="dataSource" class="com.example.config.DataSource">
        <property name="url" value="jdbc:postgresql://localhost:5432/mydb"/>
        <property name="username" value="postgres"/>
        <property name="password" value="password"/>
        <property name="maxConnections" value="10"/>
    </bean>
    
</beans>
```

### Loading XML Configuration

```java
// Classic approach
ApplicationContext context = new ClassPathXmlApplicationContext("applicationContext.xml");
UserService userService = context.getBean("userService", UserService.class);
```

### When to Use XML

- Legacy applications
- Third-party integrations requiring XML
- Configuration that changes frequently (externalized)
- Very complex conditional bean registration

---

## 5. Injection Using Java-Based Configuration

### Modern Java Configuration (Recommended)

```java
@Configuration
public class AppConfig {
    
    @Bean
    public UserRepository userRepository() {
        return new UserRepository();
    }
    
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
    
    @Bean
    public UserService userService() {
        // Constructor injection via Java config
        return new UserService(userRepository(), passwordEncoder());
    }
    
    @Bean
    public DataSource dataSource() {
        DataSource ds = new DataSource();
        ds.setUrl("jdbc:postgresql://localhost:5432/mydb");
        ds.setUsername("postgres");
        ds.setPassword("password");
        return ds;
    }
}
```

### Using @Value for External Properties

```java
@Configuration
@PropertySource("classpath:application.properties")
public class DatabaseConfig {
    
    @Value("${db.url}")
    private String dbUrl;
    
    @Value("${db.username}")
    private String dbUsername;
    
    @Value("${db.password}")
    private String dbPassword;
    
    @Bean
    public DataSource dataSource() {
        DataSource ds = new DataSource();
        ds.setUrl(dbUrl);
        ds.setUsername(dbUsername);
        ds.setPassword(dbPassword);
        return ds;
    }
}
```

### Conditional Bean Registration

```java
@Configuration
public class ConditionalConfig {
    
    @Bean
    @Profile("dev")
    public DataSource devDataSource() {
        return new H2DataSource();  // In-memory for development
    }
    
    @Bean
    @Profile("prod")
    public DataSource prodDataSource() {
        return new PostgresDataSource();  // Production database
    }
    
    @Bean
    @ConditionalOnProperty(name = "feature.cache.enabled", havingValue = "true")
    public CacheService cacheService() {
        return new RedisCacheService();
    }
}
```

---

## 6. Inversion of Control (IoC)

### Overview of Inversion of Control

**Inversion of Control (IoC)** is a design principle where the control of object creation and lifecycle is transferred from the application code to a container or framework.

### Traditional Control Flow

```java
// Application controls object creation
public class Main {
    public static void main(String[] args) {
        // You create everything
        UserRepository repo = new UserRepository();
        PasswordEncoder encoder = new BCryptPasswordEncoder();
        UserService service = new UserService(repo, encoder);
        
        // You manage lifecycle
        service.initialize();
        // ... use service ...
        service.cleanup();
    }
}
```

### IoC Control Flow

```java
// Container controls object creation
@SpringBootApplication
public class Main {
    public static void main(String[] args) {
        // Container creates and manages everything
        ApplicationContext context = SpringApplication.run(Main.class, args);
        
        // You just request the bean
        UserService service = context.getBean(UserService.class);
        // Container handles lifecycle
    }
}
```

### Key Difference

```
Traditional:  Application creates dependencies → tightly coupled
IoC:          Container creates dependencies → loosely coupled

Traditional:  public class A { B b = new B(); }  // A controls B
IoC:          public class A { B b; } + Container injects B  // Container controls
```

---

## 7. Spring IoC Container

### What is the IoC Container?

The **Spring IoC Container** is responsible for:
1. **Instantiating** beans (creating objects)
2. **Configuring** beans (setting properties)
3. **Assembling** dependencies (wiring beans together)
4. **Managing lifecycle** (initialization, destruction)

### Container Interfaces

#### BeanFactory

The root interface for accessing the Spring container.

```java
BeanFactory factory = new XmlBeanFactory(new ClassPathResource("beans.xml"));
UserService service = factory.getBean("userService", UserService.class);
```

**Characteristics**:
- Lazy loading (beans created when requested)
- Basic container functionality
- Lightweight
- Rarely used directly in modern applications

#### ApplicationContext

A sub-interface of BeanFactory with enterprise features.

```java
// Various implementations
ApplicationContext context;

// XML-based
context = new ClassPathXmlApplicationContext("applicationContext.xml");

// Java-based
context = new AnnotationConfigApplicationContext(AppConfig.class);

// Web application
context = new AnnotationConfigWebApplicationContext();
```

**Additional Features over BeanFactory**:
- Eager loading (beans created at startup)
- Event publication (`ApplicationEventPublisher`)
- Internationalization (`MessageSource`)
- Environment abstraction
- Integration with AOP
- Web application support

### ApplicationContext Implementations

| Implementation | Use Case |
|---------------|----------|
| `AnnotationConfigApplicationContext` | Java-based configuration |
| `ClassPathXmlApplicationContext` | XML from classpath |
| `FileSystemXmlApplicationContext` | XML from filesystem |
| `AnnotationConfigWebApplicationContext` | Web applications |
| `SpringApplication.run()` | Spring Boot (most common) |

---

## 8. Bean Lifecycle

### Complete Bean Lifecycle

```
1. Container Startup
         │
         ▼
2. Bean Definition Loading
         │
         ▼
3. Bean Instantiation (Constructor called)
         │
         ▼
4. Dependency Injection (Properties set)
         │
         ▼
5. BeanNameAware.setBeanName()
         │
         ▼
6. BeanFactoryAware.setBeanFactory()
         │
         ▼
7. ApplicationContextAware.setApplicationContext()
         │
         ▼
8. BeanPostProcessor.postProcessBeforeInitialization()
         │
         ▼
9. @PostConstruct method
         │
         ▼
10. InitializingBean.afterPropertiesSet()
         │
         ▼
11. Custom init-method
         │
         ▼
12. BeanPostProcessor.postProcessAfterInitialization()
         │
         ▼
13. Bean Ready for Use
         │
         ▼
14. Container Shutdown
         │
         ▼
15. @PreDestroy method
         │
         ▼
16. DisposableBean.destroy()
         │
         ▼
17. Custom destroy-method
```

### Lifecycle Callbacks

```java
@Component
public class DatabaseConnection {
    
    private Connection connection;
    
    // Called after dependency injection
    @PostConstruct
    public void init() {
        System.out.println("Initializing database connection...");
        this.connection = DriverManager.getConnection(url, user, password);
        System.out.println("Database connection established.");
    }
    
    // Called before bean destruction
    @PreDestroy
    public void cleanup() {
        System.out.println("Closing database connection...");
        if (connection != null) {
            connection.close();
        }
        System.out.println("Database connection closed.");
    }
    
    // Business method
    public void executeQuery(String sql) {
        // Use connection
    }
}
```

### Alternative Lifecycle Methods

**Using InitializingBean and DisposableBean interfaces**:
```java
@Component
public class CacheManager implements InitializingBean, DisposableBean {
    
    private Map<String, Object> cache;
    
    @Override
    public void afterPropertiesSet() throws Exception {
        // Called after properties set
        cache = new ConcurrentHashMap<>();
        loadCacheFromDisk();
    }
    
    @Override
    public void destroy() throws Exception {
        // Called on shutdown
        saveCacheToDisk();
        cache.clear();
    }
}
```

**Using @Bean annotation attributes**:
```java
@Configuration
public class AppConfig {
    
    @Bean(initMethod = "initialize", destroyMethod = "shutdown")
    public ConnectionPool connectionPool() {
        return new ConnectionPool();
    }
}
```

---

## 9. Scopes of a Bean

### Available Bean Scopes

| Scope | Description | Instances |
|-------|-------------|-----------|
| **singleton** | One instance per container (default) | 1 |
| **prototype** | New instance for each request | Many |
| **request** | One instance per HTTP request (web) | Per request |
| **session** | One instance per HTTP session (web) | Per session |
| **application** | One instance per ServletContext (web) | 1 per app |
| **websocket** | One instance per WebSocket session | Per WebSocket |

### Singleton Scope (Default)

```java
@Component  // Default is singleton
public class UserService {
    private int counter = 0;
    
    public int incrementAndGet() {
        return ++counter;  // Shared across all users!
    }
}
```

**Characteristics**:
- Single instance created at container startup
- Shared across all injection points
- Must be **stateless** or thread-safe
- Suitable for: Services, DAOs, Controllers

### Prototype Scope

```java
@Component
@Scope("prototype")
public class ShoppingCart {
    private List<Item> items = new ArrayList<>();
    
    public void addItem(Item item) {
        items.add(item);  // Each user gets their own cart
    }
    
    public List<Item> getItems() {
        return items;
    }
}
```

**Characteristics**:
- New instance created each time bean is requested
- Container does NOT manage full lifecycle (no @PreDestroy)
- Suitable for: Stateful beans, user-specific data

### Web Scopes

```java
@Component
@Scope(value = WebApplicationContext.SCOPE_REQUEST, proxyMode = ScopedProxyMode.TARGET_CLASS)
public class RequestContext {
    private final LocalDateTime requestTime = LocalDateTime.now();
    
    public LocalDateTime getRequestTime() {
        return requestTime;
    }
}

@Component
@Scope(value = WebApplicationContext.SCOPE_SESSION, proxyMode = ScopedProxyMode.TARGET_CLASS)
public class UserSession {
    private User currentUser;
    
    public void setCurrentUser(User user) {
        this.currentUser = user;
    }
    
    public User getCurrentUser() {
        return currentUser;
    }
}
```

---

## 10. Bean Definition and Instantiation

### Bean Definition

A **Bean Definition** describes how the container should create, configure, and manage a bean.

**Components of Bean Definition**:
- Class name (what type to instantiate)
- Bean name/id (how to reference it)
- Scope (singleton, prototype, etc.)
- Constructor arguments
- Property values
- Dependencies
- Lazy initialization setting
- Initialization/destruction methods

### Bean Instantiation Methods

#### 1. Constructor Instantiation (Default)

```java
@Component
public class UserService {
    public UserService() {
        // Default constructor called by container
    }
}
```

#### 2. Static Factory Method

```java
public class ConnectionFactory {
    private ConnectionFactory() {}  // Private constructor
    
    public static Connection createConnection() {
        return new Connection();
    }
}

// Configuration
@Configuration
public class AppConfig {
    @Bean
    public Connection connection() {
        return ConnectionFactory.createConnection();
    }
}
```

#### 3. Instance Factory Method

```java
public class ServiceFactory {
    public UserService createUserService() {
        return new UserService();
    }
}

@Configuration
public class AppConfig {
    @Bean
    public ServiceFactory serviceFactory() {
        return new ServiceFactory();
    }
    
    @Bean
    public UserService userService(ServiceFactory factory) {
        return factory.createUserService();
    }
}
```

### Lazy Initialization

```java
@Component
@Lazy  // Bean created on first use, not at startup
public class ExpensiveService {
    public ExpensiveService() {
        System.out.println("Creating expensive service...");
        // Heavy initialization
    }
}
```

**Global lazy initialization** (application.properties):
```properties
spring.main.lazy-initialization=true
```

---

## 11. DI Activity: Practical Example

### Complete Example: User Registration System

**User Entity**:
```java
@Entity
public class User {
    @Id @GeneratedValue
    private Long id;
    private String username;
    private String email;
    private String passwordHash;
    // getters, setters
}
```

**Repository Layer**:
```java
@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUsername(String username);
    boolean existsByEmail(String email);
}
```

**Service Layer (Using Constructor Injection)**:
```java
@Service
public class UserService {
    
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final EmailService emailService;
    
    // Constructor injection - all dependencies visible
    public UserService(UserRepository userRepository, 
                       PasswordEncoder passwordEncoder,
                       EmailService emailService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.emailService = emailService;
    }
    
    @Transactional
    public User registerUser(String username, String email, String password) {
        // Validate
        if (userRepository.existsByEmail(email)) {
            throw new EmailAlreadyExistsException(email);
        }
        
        // Create user
        User user = new User();
        user.setUsername(username);
        user.setEmail(email);
        user.setPasswordHash(passwordEncoder.encode(password));
        
        // Save
        User saved = userRepository.save(user);
        
        // Send welcome email
        emailService.sendWelcomeEmail(saved);
        
        return saved;
    }
}
```

**Configuration**:
```java
@Configuration
public class SecurityConfig {
    
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
```

**Testing (Easy because of DI)**:
```java
@ExtendWith(MockitoExtension.class)
class UserServiceTest {
    
    @Mock
    private UserRepository userRepository;
    
    @Mock
    private PasswordEncoder passwordEncoder;
    
    @Mock
    private EmailService emailService;
    
    @InjectMocks
    private UserService userService;
    
    @Test
    void registerUser_Success() {
        // Arrange
        when(userRepository.existsByEmail(anyString())).thenReturn(false);
        when(passwordEncoder.encode(anyString())).thenReturn("hashedPassword");
        when(userRepository.save(any())).thenAnswer(i -> i.getArgument(0));
        
        // Act
        User result = userService.registerUser("john", "john@example.com", "password");
        
        // Assert
        assertThat(result.getUsername()).isEqualTo("john");
        verify(emailService).sendWelcomeEmail(any());
    }
}
```

---

## Summary

Key concepts covered today:

| Topic | Key Points |
|-------|------------|
| **Dependency Injection** | Objects receive dependencies externally |
| **DI Types** | Constructor (recommended), Setter, Field |
| **XML Config** | Legacy approach using `<bean>` tags |
| **Java Config** | Modern approach using @Configuration and @Bean |
| **IoC** | Container controls object creation/lifecycle |
| **IoC Container** | BeanFactory (basic), ApplicationContext (enterprise) |
| **Bean Lifecycle** | Instantiate -> Inject -> Initialize -> Use -> Destroy |
| **Bean Scopes** | Singleton (default), Prototype, Request, Session |
| **Bean Definition** | Describes how container creates and manages beans |

**Tomorrow**: We'll dive deeper into annotation-based configuration, component scanning, and Spring Boot basics!
