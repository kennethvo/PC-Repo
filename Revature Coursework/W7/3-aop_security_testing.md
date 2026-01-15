# Week 7 - Wednesday: Spring AOP, Security, and Testing

## 1. Spring Unit Testing

Testing is crucial for maintaining code quality and preventing regressions. Spring provides excellent testing support that integrates seamlessly with JUnit and Mockito.

### Testing Pyramid

```
       /\
      /  \  E2E Tests (Few)
     /____\
    /      \  Integration Tests (Some)
   /________\
  /          \
 /____________\ Unit Tests (Many)
```

-   **Unit Tests**: Test individual classes in isolation (fast, many).
-   **Integration Tests**: Test multiple components together (slower, fewer).
-   **E2E Tests**: Test entire application flow (slowest, fewest).

---

## 2. Spring Testing Annotations

### @SpringBootTest
- **Purpose**: Loads the **entire** Spring application context.
-   **Use Case**: Integration tests that need the full application context.
-   **Characteristics**:
    -   Slow (loads all beans, configurations, database connections).
    -   Real application environment.
    -   Can test autowiring, configurations, and interactions between components.

#### Example
```java
@SpringBootTest
class UserServiceIntegrationTest {
    
    @Autowired
    private UserService userService;
    
    @Autowired
    private UserRepository userRepo;
    
    @Test
    void testCreateAndRetrieveUser() {
        // Given
        User user = new User("John", "Doe", "john@example.com");
        
        // When
        User saved = userService.save(user);
        User retrieved = userService.findById(saved.getId()).orElseThrow();
        
        // Then
        assertEquals("John", retrieved.getFirstName());
    }
}
```

### @WebMvcTest
-   **Purpose**: Loads **only the web layer** (Controllers).
-   **Use Case**: Unit testing controllers in isolation.
-   **Characteristics**:
    -   Fast (doesn't load entire context).
    -   Service layer is NOT loaded (must be mocked).
    -   Perfect for testing request mapping, validation, serialization.

#### Example
```java
@WebMvcTest(UserController.class)
class UserControllerTest {
    
    @Autowired
    private MockMvc mockMvc;  // Simulates HTTP requests
    
    @MockBean
    private UserService userService;  // Mock the dependency
    
    @Test
    void testGetUser_Success() throws Exception {
        // Arrange
        User mockUser = new User(1L, "Alice", "Smith", "alice@example.com");
        when(userService.findById(1L)).thenReturn(Optional.of(mockUser));
        
        // Act & Assert
        mockMvc.perform(get("/api/users/1"))
               .andExpect(status().isOk())
               .andExpect(jsonPath("$.firstName").value("Alice"))
               .andExpect(jsonPath("$.lastName").value("Smith"))
               .andExpect(jsonPath("$.email").value("alice@example.com"));
    }
    
    @Test
    void testGetUser_NotFound() throws Exception {
        // Arrange
        when(userService.findById(999L)).thenReturn(Optional.empty());
        
        // Act & Assert
        mockMvc.perform(get("/api/users/999"))
               .andExpect(status().isNotFound());
    }
    
    @Test
    void testCreateUser() throws Exception {
        // Arrange
        User inputUser = new User(null, "Bob", "Jones", "bob@example.com");
        User savedUser = new User(2L, "Bob", "Jones", "bob@example.com");
        when(userService.save(any(User.class))).thenReturn(savedUser);
        
        // Act & Assert
        mockMvc.perform(post("/api/users")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"firstName\":\"Bob\",\"lastName\":\"Jones\",\"email\":\"bob@example.com\"}"))
               .andExpect(status().isCreated())
               .andExpect(header().exists("Location"))
               .andExpect(jsonPath("$.id").value(2))
               .andExpect(jsonPath("$.firstName").value("Bob"));
    }
}
```

### @DataJpaTest
-   **Purpose**: Tests JPA repositories.
-   **Characteristics**:
    -   Uses in-memory database (H2 by default).
    -   Auto-configures JPA, Hibernate, and TestEntityManager.
    -   Transactional (rolls back after each test).

```java
@DataJpaTest
class UserRepositoryTest {
    
    @Autowired
    private UserRepository userRepo;
    
    @Autowired
    private TestEntityManager entityManager;
    
    @Test
    void testFindByEmail() {
        // Given
        User user = new User("Test", "User", "test@example.com");
        entityManager.persist(user);
        entityManager.flush();
        
        // When
        Optional<User> found = userRepo.findByEmail("test@example.com");
        
        // Then
        assertTrue(found.isPresent());
        assertEquals("Test", found.get().getFirstName());
    }
}
```

---

## 3. Mocking with Mockito

### @MockBean
Replaces a real bean in the Spring context with a Mockito mock.

```java
@WebMvcTest(UserController.class)
class UserControllerTest {
    
    @MockBean
    private UserService userService;  // Replaces real UserService bean
    
    @Test
    void testMocking() {
        // Define behavior
        when(userService.findById(1L)).thenReturn(Optional.of(new User()));
        
        // Use the mock
        Optional<User> user = userService.findById(1L);
        assertTrue(user.isPresent());
        
        // Verify interaction
        verify(userService, times(1)).findById(1L);
    }
}
```

### Common Mockito Patterns

```java
// Stub return value
when(userService.findById(1L)).thenReturn(Optional.of(user));

// Stub with argument matcher
when(userService.save(any(User.class))).thenReturn(savedUser);

// Stub to throw exception
when(userService.delete(999L)).thenThrow(new UserNotFoundException());

// Verify method was called
verify(userService).findById(1L);

// Verify method was called N times
verify(userService, times(2)).save(any(User.class));

// Verify method was never called
verify(userService, never()).delete(anyLong());

// Capture arguments
ArgumentCaptor<User> captor = ArgumentCaptor.forClass(User.class);
verify(userService).save(captor.capture());
User captured = captor.getValue();
assertEquals("John", captured.getFirstName());
```

---

## 4. Spring AOP (Aspect-Oriented Programming)

**AOP** allows us to separate **Cross-Cutting Concerns** from our core Business Logic.

### What are Cross-Cutting Concerns?
Logic that is needed across many parts of the application but is not part of the core business logic:
-   **Logging**: Log method entry/exit.
-   **Security**: Check permissions before method execution.
-   **Transaction Management**: Begin/commit transactions.
-   **Performance Monitoring**: Measure execution time.
-   **Error Handling**: Centralize exception handling.

### AOP Terminology

| Term | Definition |
| :--- | :--- |
| **Aspect** | A class that contains cross-cutting logic (marked with `@Aspect`) |
| **Join Point** | A specific point in program execution (in Spring AOP, always a method execution) |
| **Advice** | The action taken at a join point (the code that runs) |
| **Pointcut** | An expression that matches join points (defines *where* the advice runs) |
| **Weaving** | The process of applying aspects to target objects |

### Types of Advice

| Advice | When It Runs |
| :--- | :--- |
| `@Before` | Before the method executes |
| `@After` | After the method executes (finally block) |
| `@AfterReturning` | After successful method execution (no exception) |
| `@AfterThrowing` | After method throws an exception |
| `@Around` | Wraps the method execution completely (most powerful) |

---

## 5. Overview of AOP and Cross-Cutting Concerns

### Without AOP (Code Duplication)
```java
public void transferMoney(...) {
    log.info("Entering transferMoney");  // Logging
    long start = System.currentTimeMillis();  // Performance
    checkPermissions();  // Security
    
    try {
        // Business logic
        doTransfer();
    } catch (Exception e) {
        log.error("Error", e);
        throw e;
    } finally {
        long duration = System.currentTimeMillis() - start;
        log.info("Method took {}ms", duration);
    }
}

public void createUser(...) {
    log.info("Entering createUser");  // Same logging code!
    long start = System.currentTimeMillis();  // Same performance code!
    checkPermissions();  // Same security code!
    
    // ... rest of method
}
```

### With AOP (Separation of Concerns)
```java
// Business logic (clean and focused)
public void transferMoney(...) {
    doTransfer();
}

public void createUser(...) {
    // Just business logic
}

// Cross-cutting concerns (centralized)
@Aspect
@Component
public class LoggingAspect {
    @Before("execution(* com.example.service.*.*(..))")
    public void logBefore(JoinPoint jp) {
        log.info("Entering {}", jp.getSignature().getName());
    }
}
```

---

## 6. AspectJ

**AspectJ** is the AOP framework that Spring AOP uses under the hood. Spring AOP is a **subset** of AspectJ functionality.

### Spring AOP vs AspectJ

| Feature | Spring AOP | AspectJ |
| :--- | :--- | :--- |
| **Weaving** | Proxy-based (runtime) | Compile-time or load-time |
| **Join Points** | Only method execution | Methods, constructors, field access, etc. |
| **Performance** | Slight overhead (proxy) | No runtime overhead |
| **Complexity** | Simple | More complex |
| **Spring Integration** | Native | Requires configuration |

**Bottom Line**: Use Spring AOP for most cases. Only use full AspectJ if you need non-method join points.

---

## 7. Advice Examples

### @Before Advice
Runs **before** the target method.

```java
@Aspect
@Component
public class LoggingAspect {
    
    @Before("execution(* com.example.service.UserService.save(..))")
    public void logBeforeSave(JoinPoint jp) {
        logger.info("About to save user");
        Object[] args = jp.getArgs();
        logger.info("Arguments: {}", Arrays.toString(args));
    }
}
```

### @AfterReturning Advice
Runs **after successful execution** (when method returns normally).

```java
@Aspect
@Component
public class AuditAspect {
    
    @AfterReturning(
        pointcut = "execution(* com.example.service.UserService.save(..))",
        returning = "result"
    )
    public void auditSave(JoinPoint jp, Object result) {
        User savedUser = (User) result;
        auditRepo.save(new AuditLog("User created: " + savedUser.getId()));
    }
}
```

### @AfterThrowing Advice
Runs **when method throws an exception**.

```java
@Aspect
@Component
public class ErrorHandlingAspect {
    
    @AfterThrowing(
        pointcut = "execution(* com.example.service.*.*(..))",
        throwing = "ex"
    )
    public void handleError(JoinPoint jp, Exception ex) {
        logger.error("Exception in {}: {}", jp.getSignature(), ex.getMessage());
        notificationService.sendAlert("Error in " + jp.getSignature());
    }
}
```

### @Around Advice
**Wraps** the method execution. Most powerful; can control whether to proceed.

```java
@Aspect
@Component
public class PerformanceAspect {
    
    @Around("execution(* com.example.service.*.*(..))")
    public Object measurePerformance(ProceedingJoinPoint pjp) throws Throwable {
        long start = System.currentTimeMillis();
        
        Object result = pjp.proceed();  // Execute the target method
        
        long duration = System.currentTimeMillis() - start;
        logger.info("{} took {}ms", pjp.getSignature(), duration);
        
        return result;
    }
}
```

---

## 8. Pointcut and Join Points

### Pointcut Expression Syntax

```
execution(modifiers? return-type declaring-type? method-name(parameters) exceptions?)
```

#### Examples

| Expression | Matches |
| :--- | :--- |
| `execution(* *(..))` | All methods |
| `execution(public * *(..))` | All public methods |
| `execution(* com.example.service.*.*(..))` | All methods in any class in `service` package |
| `execution(* com.example.service..*. *(..))` | All methods in`service` package and sub-packages |
| `execution(* com.example.service.UserService.*(..))` | All methods in `UserService` |
| `execution(* com.example.service.UserService.save(..))` | `save` method in `UserService` |
| `execution(User com.example.service.UserService.save(..))` | `save` method that returns `User` |
| `execution(* save(User))` | `save` method that takes `User` parameter |
| `execution(* save(*))` | `save` method with exactly one parameter |
| `execution(* save(..))` | `save` method with any number of parameters |

### Combining Pointcuts

```java
@Aspect
@Component
public class CombinedAspect {
    
    // Define reusable pointcuts
    @Pointcut("execution(* com.example.service.*.*(..))")
    public void serviceMethods() {}
    
    @Pointcut("execution(* com.example.repository.*.*(..))")
    public void repositoryMethods() {}
    
    // Combine with AND
    @Before("serviceMethods() && args(user)")
    public void logUserOperations(User user) {
        logger.info("Operating on user: {}", user.getEmail());
    }
    
    // Combine with OR
    @Around("serviceMethods() || repositoryMethods()")
    public Object measureAll(ProceedingJoinPoint pjp) throws Throwable {
        // Measure performance for both service and repository methods
        return pjp.proceed();
    }
}
```

---

## 9. Spring Security

Spring Security is a powerful, customizable authentication and access-control framework.

### Core Concepts

#### 1. Authentication (Who are you?)
-   **Definition**: Verifying the identity of a principal (user, device, system).
-   **Process**: Credentials (username/password, token, certificate) are validated.
-   **Handled By**: `AuthenticationManager` and `AuthenticationProvider`.

#### 2. Authorization (What can you do?)
-   **Definition**: Deciding if the authenticated principal has permission to access a resource.
-   **Based On**: **Roles** (e.g., `ROLE_ADMIN`, `ROLE_USER`) or **Authorities** (e.g., `READ_PRIVILEGE`, `WRITE_PRIVILEGE`).

---

## 10. Authentication

### Authentication Providers

Spring Security supports multiple authentication mechanisms:

| Provider | Description |
| :--- | :--- |
| **In-Memory** | Users stored in application memory (for testing) |
| **JDBC** | Users stored in database |
| **LDAP** | Users stored in LDAP directory |
| **OAuth2** | Third-party authentication (Google, GitHub) |
| **Custom** | Implement `AuthenticationProvider` interface |

### In-Memory Authentication (Simple Example)

```java
@Configuration
@EnableWebSecurity
public class SecurityConfig {
    
    @Bean
    public UserDetailsService userDetailsService() {
        UserDetails user = User.builder()
                .username("user")
                .password(passwordEncoder().encode("password"))
                .roles("USER")
                .build();
        
        UserDetails admin = User.builder()
                .username("admin")
                .password(passwordEncoder().encode("admin"))
                .roles("ADMIN", "USER")
                .build();
        
        return new InMemoryUserDetailsManager(user, admin);
    }
    
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
```

### Database Authentication (Production)

```java
@Service
public class CustomUserDetailsService implements UserDetailsService {
    
    @Autowired
    private UserRepository userRepo;
    
    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = userRepo.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + username));
        
        return org.springframework.security.core.userdetails.User.builder()
                .username(user.getUsername())
                .password(user.getPassword())
                .roles(user.getRoles().toArray(new String[0]))
                .build();
    }
}
```

---

## 11. Authorization

### Role-Based Access Control (RBAC)

```java
@RestController
@RequestMapping("/api/users")
public class UserController {
    
    @GetMapping
    @PreAuthorize("hasRole('USER')")  // Requires USER role
    public List<User> getAllUsers() {
        return userService.findAll();
    }
    
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")  // Requires ADMIN role
    public void deleteUser(@PathVariable Long id) {
        userService.delete(id);
    }
    
    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")  // Requires ADMIN or MANAGER
    public User createUser(@RequestBody User user) {
        return userService.save(user);
    }
    
    @GetMapping("/{id}")
    @PreAuthorize("hasRole('USER') and #id == authentication.principal.id") // Can only access own data
    public User getUser(@PathVariable Long id) {
        return userService.findById(id).orElseThrow();
    }
}
```

---

## 12. SecurityFilterChain

The **SecurityFilterChain** is the core configuration for Spring Security. It defines which requests require authentication and what authentication mechanisms to use.

### Basic Configuration (Spring Boot 3+)

```java
@Configuration
@EnableWebSecurity
@EnableMethodSecurity  // Enable @PreAuthorize, @PostAuthorize
public class SecurityConfig {
    
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Throwable {
        http
            .csrf(csrf -> csrf.disable())  // Disable CSRF for REST APIs
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/public/**").permitAll()  // Public endpoints
                .requestMatchers("/api/admin/**").hasRole("ADMIN")  // Admin only
                .requestMatchers("/api/**").authenticated()  // Require authentication
                .anyRequest().permitAll()  // All other requests allowed
            )
            .httpBasic(Customizer.withDefaults());  // Use HTTP Basic Auth
        
        return http.build();
    }
}
```

### Advanced Configuration

```java
@Bean
public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
    http
        .csrf(csrf -> csrf.disable())
        .sessionManagement(session -> session
            .sessionCreationPolicy(SessionCreationPolicy.STATELESS))  // Stateless (REST API)
        .authorizeHttpRequests(auth -> auth
            .requestMatchers("/auth/**").permitAll()
            .requestMatchers("/api/public/**").permitAll()
            .requestMatchers(HttpMethod.GET, "/api/users").hasAnyRole("USER", "ADMIN")
            .requestMatchers(HttpMethod.POST, "/api/users").hasRole("ADMIN")
            .requestMatchers(HttpMethod.DELETE, "/api/users/**").hasRole("ADMIN")
            .anyRequest().authenticated()
        )
        .httpBasic(Customizer.withDefaults())
        .formLogin(form -> form
            .loginPage("/login")
            .defaultSuccessUrl("/dashboard")
            .permitAll()
        )
        .logout(logout -> logout
            .logoutUrl("/logout")
            .logoutSuccessUrl("/login?logout")
            .invalidateHttpSession(true)
            .deleteCookies("JSESSIONID")
        );
    
    return http.build();
}
```

---

## 13. Complete Security Example

```java
// Security Configuration
@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {
    
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable())
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/public/**").permitAll()
                .requestMatchers("/api/admin/**").hasRole("ADMIN")
                .anyRequest().authenticated()
            )
            .httpBasic(Customizer.withDefaults());
        
        return http.build();
    }
    
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}

// Controller with Security
@RestController
@RequestMapping("/api/users")
public class UserController {
    
    @GetMapping("/public/count")
    public long getUserCount() {
        return userService.count();  // No authentication required
    }
    
    @GetMapping
    @PreAuthorize("hasRole('USER')")
    public List<User> getAllUsers() {
        return userService.findAll();
    }
    
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public void deleteUser(@PathVariable Long id) {
        userService.delete(id);
    }
}
```

---

## 14. Best Practices

### Testing
1.  **Test pyramid**: Many unit tests, some integration tests, few E2E tests.
2.  **Use @WebMvcTest**: Fast controller tests with mocked services.
3.  **Mock external dependencies**: Don't call real databases/APIs in unit tests.
4.  **Use @DataJpaTest**: Test repositories with in-memory database.
5.  **Test edge cases**: Nulls, empty lists, exceptions.

### AOP
1.  **Keep aspects focused**: One concern per aspect (logging, security, etc.).
2.  **Use specific pointcuts**: Avoid matching too many methods.
3.  **Avoid complex logic in aspects**: Keep advice simple and focused.
4.  **Be aware of proxy limitations**: AOP doesn't work for self-invocation (calling methods within the same class).

### Security
1.  **Never store plain text passwords**: Always use `PasswordEncoder`.
2.  **Use HTTPS in production**: Protect credentials in transit.
3.  **Implement proper authorization**: Don't rely on security by obscurity.
4.  **Use @PreAuthorize**: Method-level security for fine-grained control.
5.  **Disable CSRF for stateless REST APIs**: Enable for traditional web apps.
6.  **Implement rate limiting**: Prevent brute-force attacks.
