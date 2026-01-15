# Spring Framework

### Q1: What is the `ApplicationContext`?

**Keywords:** IoC Container, BeanFactory, Enterprise Features
<details>
<summary>Click to Reveal Answer</summary>

The **`ApplicationContext`** is the central interface for the Spring IoC container. It is a sub-interface of `BeanFactory`.

While `BeanFactory` provides basic DI capabilities, `ApplicationContext` adds enterprise-specific functionality:

- Pre-instantiation of Singletons (Eager loading).
- Event publication.
- Internationalization (i18n) support.
- Integration with AOP features.

</details>

---

### Q2: What is the purpose of Spring Boot?

**Keywords:** Auto-configuration, Stand-alone, Opinionated
<details>
<summary>Click to Reveal Answer</summary>

**Spring Boot** is built on top of the Spring Framework to simplify the bootstrapping and development of new Spring applications. Its main features are:

1. **Auto-configuration**: Automatically configures Spring based on classpath dependencies.
2. **Stand-alone**: Embeds a servlet container (Tomcat, Jetty) so no WAR deployment is needed.
3. **Opinionated**: Provides "Starter" POMs with curated dependencies.

</details>

---

### Q3: Explain the concept of Transaction Propagation. Specifically, what happens if a method marked `@Transactional(propagation = Propagation.REQUIRED)` calls another method marked `@Transactional(propagation = Propagation.REQUIRES_NEW)`?

**Keywords:** Suspend, New Transaction, Rollback independence
<details>
<summary>Click to Reveal Answer</summary>

**Propagation** defines how transactions relate to each other.

1. **Method A (`REQUIRED`)** starts a transaction (Tx1).
2. Method A calls **Method B (`REQUIRES_NEW`)**.
3. **Tx1 is suspended**.
4. **Tx2 is created** (a completely new physical transaction) for Method B.
5. Method B completes. Tx2 commits or rolls back **independently** of Tx1.
6. **Tx1 resumes**. Method A continues.

**Implication**: If Method B fails and rolls back, Method A can still catch the exception and commit Tx1 (if designed so). If Method A fails, it rolls back Tx1, but Tx2 (already committed) remains committed.
</details>

---

### Q4: What is a POJO and why is it important in Spring?

**Keywords:** Plain Old Java Object, Simplicity, Decoupling
<details>
<summary>Click to Reveal Answer</summary>

A **POJO (Plain Old Java Object)** is a simple Java object that is not bound by any special restrictions (like extending a specific class or implementing an interface from a heavy framework like EJB 2.x).

**Spring's Importance**: Spring promotes POJO programming, meaning your business logic doesn't have to be tightly coupled to the framework code. This makes your code easier to **test**, **read**, and **maintain**.
</details>

---

### Q5: What is the difference between `@Controller` and `@RestController`?

**Keywords:** @ResponseBody, JSON, View Resolution
<details>
<summary>Click to Reveal Answer</summary>

- **`@Controller`** is used for traditional Spring MVC. Its methods typically return a **String** representing a logical view name (resolved to HTML/JSP). To return data, you must add `@ResponseBody`.
- **`@RestController`** is a convenience annotation for RESTful web services. It combines `@Controller` and `@ResponseBody`. Its methods return **data** (JSON/XML) directly to the response body.

</details>

---

### Q6: What is a Spring Boot "Starter"?

**Keywords:** Dependency Descriptor, BOM, Curated Dependencies
<details>
<summary>Click to Reveal Answer</summary>

A **Starter** is a convenient dependency descriptor (a Maven/Gradle dependency) that aggregates a set of common libraries for a specific purpose.

For example, `spring-boot-starter-web` includes:

- Spring MVC
- Embedded Tomcat
- Jackson (for JSON)
- Validation API

This eliminates the need to manually manage versions for compatible libraries.
</details>

---

### Q7: You have a service that needs a mandatory dependency `UserRepository`. How should you inject it and why?

**Keywords:** Constructor Injection, Immutability, Testing
<details>
<summary>Click to Reveal Answer</summary>

You should use **Constructor Injection**.

```java
@Service
public class UserService {
    private final UserRepository repo;

    public UserService(UserRepository repo) {
        this.repo = repo;
    }
}
```

**Why?**

1. **Immutability**: The dependency can be marked `final`.
2. **Validity**: The object cannot be instantiated without its required dependency (prevents `NullPointerException`).
3. **Testing**: Easy to pass a mock object into the constructor during unit tests without needing Spring Context or Reflection.

</details>

---

### Q8: What does the `@SpringBootApplication` annotation do?

**Keywords:** Configuration, ComponentScan, EnableAutoConfiguration
<details>
<summary>Click to Reveal Answer</summary>

`@SpringBootApplication` is a convenience annotation that combines three other annotations:

1. **`@Configuration`**: Marks the class as a source of bean definitions.
2. **`@ComponentScan`**: Tells Spring to look for other components/configs in the current package and sub-packages.
3. **`@EnableAutoConfiguration`**: Triggers Spring Boot's auto-configuration mechanism to configure beans based on classpath dependencies.

</details>

---

### Q9: What is the "N+1 Select Problem" in Hibernate and how can you solve it?

**Keywords:** Lazy Loading, JOIN FETCH, BatchSize
<details>
<summary>Click to Reveal Answer</summary>

The **N+1 problem** occurs when you fetch a list of N entities (1 query), and then access a Lazily loaded relationship for each entity, causing N additional queries.

- Example: Fetch 100 Users (1 query). Loop through users and call `user.getAddress()` (100 queries). Total = 101 queries.

**Solutions**:

1. **JOIN FETCH**: Write a JPQL query that forces an eager join: `SELECT u FROM User u JOIN FETCH u.address`.
2. **@EntityGraph**: Define a graph of attributes to fetch eagerly.
3. **@BatchSize**: Configure Hibernate to fetch related entities in batches (e.g., 10 at a time) rather than 1 by 1.

</details>

---

### Q10: Explain the `@RequestMapping` annotation (and its specific variants)

**Keywords:** URL Mapping, HTTP Methods, DispatcherServlet
<details>
<summary>Click to Reveal Answer</summary>

**`@RequestMapping`** is used to map web requests to Spring Controller methods. It can categorize requests by URL, HTTP method (GET/POST), params, and headers.

**Variants** (Shortcuts):
For cleaner code, we typically use the method-specific shortcuts:

- `@GetMapping`
- `@PostMapping`
- `@PutMapping`
- `@DeleteMapping`

</details>

---

### Q11: What is the purpose of the `@Autowired` annotation?

**Keywords:** Dependency Injection, Wiring, Component Scanning
<details>
<summary>Click to Reveal Answer</summary>

**`@Autowired`** is used to instruct Spring to inject a dependency into a bean. It can be applied to:

1. **Constructors**: Spring looks for a bean of the parameter type and passes it in.
2. **Fields**: Spring injects the value directly (reflection).
3. **Setters**: Spring calls the setter method with the dependency.

It resolves dependencies primarily by **Type**. If multiple beans of the same type exist, it tries to resolve by Name (Qualifier).
</details>

---

### Q12: Implementation: How would you expose custom metrics or check the health of your application in Production?

**Keywords:** Actuator, Endpoints, Health Indicator
<details>
<summary>Click to Reveal Answer</summary>

You would use **Spring Boot Actuator**.

1. Add `spring-boot-starter-actuator` dependency.
2. This exposes endpoints like `/actuator/health` and `/actuator/metrics`.
3. To add a custom health check, you can implement the `HealthIndicator` interface and override the `health()` method to return `Health.up()` or `Health.down()` details.

</details>

---

### Q13: What is Dependency Injection and what are the three types supported by Spring?

**Keywords:** Constructor, Setter, Field, Wiring
<details>
<summary>Click to Reveal Answer</summary>

**Dependency Injection (DI)** is a pattern where an object's dependencies are provided ("injected") by an external entity rather than the object creating them itself.

The three types are:

1. **Constructor Injection** (Recommended): Dependencies provided via constructor. Ensures immutability and valid state.
2. **Setter Injection**: Dependencies provided via setter methods. Useful for optional dependencies.
3. **Field Injection**: Dependencies injected directly into fields (`@Autowired` on field). Not recommended due to testing difficulties.

</details>

---

### Q14: What is Hibernate and how does it relate to JPA?

**Keywords:** ORM, Provider, Specification
<details>
<summary>Click to Reveal Answer</summary>

- **Hibernate** is an **Object-Relational Mapping (ORM)** framework that maps Java objects to database tables.
- **JPA (Java Persistence API)** is the **standard specification** (interface) for ORM in Java.
- Relationship: **Hibernate is an implementation (provider) of the JPA specification.** You usually write code against JPA interfaces (`EntityManager`), and Hibernate runs under the hood.

</details>

---

### Q15: What is `application.properties` (or `.yml`) used for?

**Keywords:** Configuration, Key-Value, Externalization
<details>
<summary>Click to Reveal Answer</summary>

It is the central configuration file for a Spring Boot application. It allows you to **externalize configuration** so you can work with the same application code in different environments.
Common uses:

- Database URL/Credentials (`spring.datasource.url`).
- Server Port (`server.port`).
- Logging levels (`logging.level`).
- Custom application properties.

</details>

---

### Q16: Explain the `@PathVariable` vs `@RequestParam` annotations

**Keywords:** URI Template, Query Parameter, Resource ID vs Filter
<details>
<summary>Click to Reveal Answer</summary>

- **`@PathVariable`**: Binds a placeholder from the **URI path** (e.g., `/users/{id}`). It is typically used to identify a specific **resource**.
  - Example: `GET /users/42` -> `@PathVariable("id") int id` values 42.
- **`@RequestParam`**: Binds a **query parameter** from the URL (e.g., `/users?role=admin`). It is typically used for **filtering or sorting**.
  - Example: `GET /users?role=admin` -> `@RequestParam("role") String role` values "admin".

</details>

---

### Q17: What is the difference between an H2 database and PostgreSQL/MySQL?

**Keywords:** In-memory, Embedded, Persistence, Testing
<details>
<summary>Click to Reveal Answer</summary>

- **H2**: Is an **in-memory**, embedded database written in Java.
  - *Pros*: Extremely fast, requires no installation, great for **testing** and development.
  - *Cons*: Data is lost when the application stops (volatile) by default.
- **PostgreSQL/MySQL**: Are standalone, persisted RDBMS servers.
  - *Pros*: Data is persisted to disk, handles real-world concurrency, production ready.

</details>

---

### Q18: What is Inversion of Control (IoC) and how does Spring implement it?

**Keywords:** Control transfer, Container, Dependency Injection
<details>
<summary>Click to Reveal Answer</summary>

**Inversion of Control (IoC)** is a design principle where the control of object creation and management is transferred from the programmer to a framework or container. Instead of creating dependencies manually (using `new`), the framework manages them.

Spring implements IoC through **Dependency Injection (DI)** using its **IoC Container** (ApplicationContext), which instantiates, configures, and assembles beans.
</details>

---

### Q19: You have two implementations of an interface `PaymentService` (`CreditCardService` and `PayPalService`). How do you tell Spring which one to inject?

**Keywords:** `@Qualifier`, `@Primary`, Ambiguity
<details>
<summary>Click to Reveal Answer</summary>

If you just use `@Autowired PaymentService service`, Spring throws a `NoUniqueBeanDefinitionException`. You can resolve this by:

1. **`@Qualifier("beanName")`**: Use this annotation at the injection point to specify the exact bean name (e.g., "creditCardService").
2. **`@Primary`**: Annotate one of the implementation classes with `@Primary`. This makes it the default choice when no qualifier is specified.

</details>

---

### Q20: What is the Front Controller Design Pattern?

**Keywords:** DispatcherServlet, Centralized, Routing
<details>
<summary>Click to Reveal Answer</summary>

The **Front Controller** pattern ensures that all incoming web requests for an application are handled by a single entry point (a central servlet).
In Spring MVC, the **DispatcherServlet** acts as the Front Controller. It receives every request and delegates it to the appropriate Controller based on the URL mapping. This centralizes common logic like routing, security, and locale handling.
</details>

---

### Q21: What is the default scope of a Spring Bean? Name one other scope

**Keywords:** Singleton, Prototype, Request, Session
<details>
<summary>Click to Reveal Answer</summary>

 The default scope is **Singleton**, meaning the container creates only **one instance** of the bean per application context.

Other scopes include:

- **Prototype**: A new instance is created every time the bean is requested.
- **Request**: A new instance per HTTP request (Web only).
- **Session**: A new instance per HTTP session (Web only).

</details>

---

### Q22: A POST request to create a user fails with a 400 Bad Request. You suspect the JSON is invalid. How do you implement validation in Spring MVC?

**Keywords:** @Valid, @NotNull, BindingResult
<details>
<summary>Click to Reveal Answer</summary>

1. Add validation annotations (JSR-303) to your DTO/Entity:

    ```java
    class UserDTO {
        @NotNull
        private String username;
    }
    ```

2. Add `@Valid` (or `@Validated`) to the controller method parameter:

    ```java
    @PostMapping("/users")
    public ResponseEntity createUser(@Valid @RequestBody UserDTO user) { ... }
    ```

3. Spring will automatically return 400 if validation fails. You can handle errors globally using `@ControllerAdvice`.

</details>

---

### Q23: Explain the Spring Bean Lifecycle in detail. When would you use `BeanPostProcessor`?

**Keywords:** Instantiation, Properties, Initialization, Proxy, AOP
<details>
<summary>Click to Reveal Answer</summary>

The lifecycle flow is:

1. **Instantiation**: Constructor called.
2. **Populate Properties**: DI happens.
3. **BeanNameAware / BeanFactoryAware**: setX methods called if interfaces implemented.
4. **BeanPostProcessor (BeforeInitialization)**: Custom modification *before* init.
5. **Initialization**: `@PostConstruct`, `afterPropertiesSet()`, `init-method`.
6. **BeanPostProcessor (AfterInitialization)**: Custom modification *after* init (This is where AOP proxies are often created).
7. **Destruction**: `@PreDestroy`, `destroy()`.

**Use Case for BeanPostProcessor**:

- You want to modify bean instances globally (e.g., wrapping them in a Proxy for AOP, checking for custom annotations).

</details>

---

### Q24: Explain the difference between `@Component`, `@Service`, and `@Repository`

**Keywords:** Stereotype, Layer, Exception Translation
<details>
<summary>Click to Reveal Answer</summary>

All three are **stereotype annotations** that mark a class as a Spring Bean, but they carry different semantic meanings:

1. **`@Component`**: Genetic annotation for any Spring-managed component.
2. **`@Service`**: Specialization for the **Service Layer** (business logic). Currently matches `@Component` behaviorally but clarifies intent.
3. **`@Repository`**: Specialization for the **Data Access Layer** (DAOs). It adds automatic **exception translation** (converting SQL exceptions to Spring's `DataAccessException` hierarchy).

</details>

---

### Q25: What is an Entity in JPA?

**Keywords:** Table Map, @Entity, @Id
<details>
<summary>Click to Reveal Answer</summary>

An **Entity** is a lightweight, persistent domain object. It represents a **table** in a relational database, and each instance corresponds to a **row** in that table.

It must:

1. Be annotated with **`@Entity`**.
2. Have a primary key annotated with **`@Id`**.
3. (Generally) Have a no-args constructor for the JPA provider to instantiate it.

</details>

---

### Q26: Your `findAll()` method is running very slowly because it's fetching thousands of records. How can you solve this using Spring Data JPA?

**Keywords:** Pagination, Pageable, PageRequest
<details>
<summary>Click to Reveal Answer</summary>

You should use **Pagination**.

1. Extend `JpaRepository` (which extends `PagingAndSortingRepository`).
2. Modify your controller to accept page/size parameters (or use `Pageable`).
3. Pass a `PageRequest` to the repository.

```java
Page<User> users = repo.findAll(PageRequest.of(0, 20)); // Get first 20 records
```

</details>

---

### Q27: How do you handle different configurations for Local vs Production environments in Spring Boot?

**Keywords:** Profiles, application.properties, Activation
<details>
<summary>Click to Reveal Answer</summary>

You use **Spring Profiles**.

1. Create separate property files:
    - `application-dev.properties` (Local DB URL, Debug logging)
    - `application-prod.properties` (RDS URL, Info logging)
2. Define profile-specific beans using `@Profile("dev")`.
3. Activate the specific profile at runtime:
    - In `application.properties`: `spring.profiles.active=dev`
    - Command line arg: `--spring.profiles.active=prod`

</details>

---

### Q28: What happens if you try to visit a URL that is not defined in your application (e.g., `/random`)?

**Keywords:** 404, Whitelabel Error Page, DispatcherServlet
<details>
<summary>Click to Reveal Answer</summary>

By default, Spring Boot provides a **Whitelabel Error Page**.

1. The `DispatcherServlet` cannot find a handler for the request.
2. It throws a 404 Not Found error.
3. The `/error` mapping catches it and displays a generic JSON (for APIs) or HTML (for browsers) response.
You can customize this by creating a custom `ErrorController` or an `error.html` template.

</details>

---

### Q29: Explain the concept of "Fetching Strategies" (Lazy vs Eager) in Hibernate. When would you use each?

**Keywords:** Performance, Proxy, N+1 Problem
<details>
<summary>Click to Reveal Answer</summary>

Fetch strategies determine *when* related entities are loaded from the database.

- **Eager (`FetchType.EAGER`)**: Related entities are loaded **immediately** with the parent (usually via a JOIN).
  - *Use when:* You almost always need the related data (e.g., User and their Settings).
- **Lazy (`FetchType.LAZY`)**: Related entities are loaded **on-demand** (when you call the getter). The field initially contains a proxy.
  - *Use when:* The related data is large or rarely needed (e.g., User and their 10,000 Posts).
  - *Warning:* Accessing lazy data outside a transaction causes `LazyInitializationException`.

</details>

---

### Q30: What is the main difference between HTTP GET and POST methods (in the context of REST)?

**Keywords:** Idempotency, Body, Safety
<details>
<summary>Click to Reveal Answer</summary>

1. **Usage**:
    - **GET**: Used to **retrieve** data. It should have no side-effects (Safe).
    - **POST**: Used to **submit** data to be processed (e.g., create a resource).
2. **Data Location**:
    - **GET**: Data is sent in the **URL** (Query params). Limit on length.
    - **POST**: Data is sent in the **Request Body**. No specific limit.
3. **Idempotency**:
    - **GET**: Idempotent (calling it multiple times has same effect).
    - **POST**: Not Idempotent (calling it multiple times creates multiple resources).

</details>
