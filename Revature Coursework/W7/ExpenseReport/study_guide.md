
### Overview of Dependency Injection
• Design pattern where dependencies are provided externally rather than created internally by the class. This promotes loose coupling, makes code more testable (can inject mocks), and follows the Dependency Inversion Principle. Instead of a class creating its own dependencies with `new`, Spring provides them through constructors, setters, or fields.
• Example: Constructor injection used in ExpenseController, ExpenseService, ReportService, AuthController, and WebConfig - for instance, ExpenseController receives ExpenseService through its constructor, so Spring injects it automatically when creating the controller bean.

#### Types of Dependency Injection (Constructor, Setter, Field)
• Three types: Constructor (dependencies via constructor - recommended, ensures immutability and required dependencies), Setter (via setter methods - allows optional dependencies), Field (via @Autowired on fields - less visible but convenient). Constructor injection is preferred because it makes dependencies explicit and enables immutable beans.
• Example: Constructor injection is used throughout the project (ExpenseController, ExpenseService, etc.) - each class declares its dependencies as final fields and receives them through constructor parameters, which Spring automatically resolves from its container.

#### Injection using-XML-based Configuration
• XML-based DI configuration using <bean> tags in applicationContext.xml to define beans, their properties, and dependencies. This was the traditional Spring approach before annotations. You'd define beans like `<bean id="expenseService" class="com.revature.ExpenseReport.Service.ExpenseService">` and wire dependencies with `<constructor-arg>` or `<property>` tags.
• This project uses Java-based configuration instead - all configuration is done through Java classes and annotations, which is more type-safe and easier to refactor.

#### Injection using Java-based Configuration
• DI configuration using @Configuration classes and @Bean methods. Classes annotated with @Configuration contain @Bean methods that return objects managed by Spring. This approach provides compile-time type checking and is easier to understand than XML. The @Bean annotation tells Spring to manage the returned object's lifecycle.
• Example: WebConfig.java uses @Configuration annotation to configure web-related beans; @Bean methods in ExpenseReportApplication (passwordEncoder returns a BCryptPasswordEncoder instance, seedData returns a CommandLineRunner that seeds the database) - these beans are created once and reused throughout the application.

#### DI Activity

#### Overview of Inversion of Control
• Design principle where the framework controls object creation and dependency management instead of the application. In traditional programming, you create objects with `new` - IoC flips this so the framework (Spring) creates and manages objects for you. This reduces coupling and gives you a central place to configure object relationships.
• Example: Spring IoC container manages all beans in the ExpenseReport application - you don't manually create ExpenseService or ExpenseRepository; Spring creates them, manages their lifecycle, and injects dependencies automatically when the application starts.

#### Spring IoC Container
• Container that manages beans (objects), their lifecycle, and dependency injection. The IoC container is the core of Spring - it instantiates, configures, and assembles beans. The ApplicationContext is the actual container implementation that loads bean definitions and provides services like dependency injection. It handles singleton creation, prototype scoping, and ensures dependencies are satisfied before creating a bean.
• Example: Spring container manages all @Service, @Component, and @RestController beans - when the application starts, Spring scans for these annotations, creates instances (as singletons by default), resolves their dependencies, and makes them available for injection into other beans.

#### Bean Lifecycle
• Beans go through initialization, dependency injection, and destruction phases managed by the container. The lifecycle includes: instantiation (container creates bean instance), population of properties (setter/field injection), bean initialization (@PostConstruct methods), and bean destruction (@PreDestroy methods). Understanding this helps with cleanup, resource management, and initialization logic.

#### Scopes of a Bean
• Bean scopes: singleton (default - one instance per container), prototype (new instance each time requested), request (one per HTTP request in web apps), session (one per HTTP session), application (one per ServletContext). The scope determines how many instances of a bean exist and when they're created. Singleton is most common and efficient for stateless services; prototype is used when you need fresh instances each time.

#### Bean Definition and Instantiation
• Beans are defined with annotations or configuration and instantiated by the IoC container. You define beans using @Component/@Service/@Repository annotations or @Bean methods in @Configuration classes. Spring reads these definitions, instantiates the beans (usually eagerly at startup for singletons), and manages their lifecycle. The container decides when to create instances and ensures dependencies are available.
• Example: @Bean methods in ExpenseReportApplication define PasswordEncoder and CommandLineRunner beans - the passwordEncoder bean is created once and can be injected anywhere (like in AuthController), and the seedData CommandLineRunner bean executes after the application context loads, populating the database with initial data.

### Annotation-based Configuration
• Using annotations like @Component, @Service instead of XML configuration. This modern approach uses Java annotations to mark classes as Spring-managed components, making configuration more concise and type-safe. Annotations are processed at compile-time and runtime through reflection, allowing Spring to automatically discover and configure beans without verbose XML files.
• Example: All classes use annotation-based configuration (@Service, @Component, @RestController) - for instance, ExpenseService is marked with @Service, so Spring automatically recognizes it as a service bean without any XML configuration, making the codebase cleaner and easier to maintain.

#### Component Scanning
• Spring automatically discovers and registers components in specified packages via @ComponentScan. Instead of manually declaring every bean, Spring scans classpath packages looking for classes annotated with @Component and its specializations (@Service, @Repository, @Controller). This makes configuration automatic - just annotate your classes and Spring finds them. You can specify base packages, exclude filters, or include filters.
• Example: @SpringBootApplication includes component scanning for the com.revature.ExpenseReport package - Spring automatically discovers all classes with stereotype annotations in this package and its subpackages, so ExpenseService, ExpenseController, JwtUtil, etc. are all automatically registered as beans without explicit configuration.

#### Stereotype Annotations (@Component, @Service, @Repository, @Controller)
• Specialized annotations for different layers: @Component (generic Spring-managed component), @Service (business logic/service layer), @Repository (data access layer, also enables exception translation from SQL to DataAccessException), @Controller/@RestController (web layer, handles HTTP requests). All are specialized @Component annotations - functionally similar but semantically meaningful for layering and future Spring features.
• Example: @Service (ExpenseService, ReportService contain business logic), @Component (JwtUtil, JwtInterceptor are utility/helper classes), @RestController (all controllers handle HTTP requests and return JSON), Repository interfaces extend JpaRepository (Spring Data automatically creates repository implementations from interfaces, so they don't need @Repository annotation, but the concept is the same).

#### Overview of Spring Boot
• Framework built on Spring that simplifies configuration with auto-configuration and convention over configuration. Spring Boot eliminates boilerplate configuration by automatically configuring beans based on classpath dependencies. It follows "opinionated defaults" - sensible configurations that work out of the box. Features include embedded servers (Tomcat), starter dependencies (pre-configured dependency sets), and production-ready features (actuator, metrics).
• Example: ExpenseReportApplication class with @SpringBootApplication annotation - this single annotation combines @Configuration, @ComponentScan, and @EnableAutoConfiguration, automatically setting up the Spring context, scanning for components, and configuring features based on dependencies in pom.xml (like JPA, WebMvc).

#### Using Spring Initializr
• Web-based tool (start.spring.io) to generate Spring Boot project structure with dependencies. You select project metadata (group, artifact, Java version), Spring Boot version, and dependencies (like Web, JPA, DevTools), then Initializr generates a complete project with pom.xml, main application class, and proper directory structure. This saves time and ensures correct configuration from the start.

#### Auto-Configuration
• Spring Boot automatically configures beans based on classpath dependencies and properties. When Spring Boot detects certain classes on the classpath (like Hibernate, Tomcat, Jackson), it automatically configures related beans with sensible defaults. For example, if it finds spring-boot-starter-data-jpa, it automatically configures a DataSource, EntityManagerFactory, and TransactionManager. You can override these with your own @Bean definitions or application.properties.
• Example: Auto-configuration sets up DataSource, JPA, and WebMvc based on starter dependencies in pom.xml - because spring-boot-starter-data-jpa is present, Spring Boot automatically creates a DataSource bean and configures JPA; because spring-boot-starter-webmvc is present, it sets up DispatcherServlet and JSON serialization, all without manual configuration.

#### Overview of Common Spring Boot Starters (Web, Data JPA)
• Pre-configured dependency sets: spring-boot-starter-webmvc (includes Spring MVC, embedded Tomcat, Jackson for JSON, validation), spring-boot-starter-data-jpa (includes Hibernate, Spring Data JPA, JDBC drivers, connection pooling). Starters bundle related dependencies together so you don't need to manually add each library. They ensure version compatibility and provide sensible defaults.
• Example: pom.xml includes spring-boot-starter-webmvc and spring-boot-starter-data-jpa dependencies - adding just these two dependencies brings in dozens of transitive dependencies (like Hibernate, Tomcat, Jackson) that are all tested and configured to work together, enabling REST APIs and database access with minimal setup.

#### DevTools
• Development tools providing hot reloading and automatic restarts during development. DevTools adds features like automatic application restart when classpath files change, LiveReload support for browser refresh, property defaults that favor development over production, and remote debugging capabilities. It's automatically disabled in production and only active in development mode.
• Example: spring-boot-devtools dependency in pom.xml - when you modify Java classes and rebuild, DevTools automatically restarts the application, or with IDE integration, changes can trigger hot reloading without full restarts, speeding up development cycles significantly.

#### Spring Environments
• Configuration profiles (dev, test, prod) for environment-specific settings. Spring Boot supports profiles via application-{profile}.properties files or @Profile annotation. You can activate profiles with spring.profiles.active property. This allows different database connections, logging levels, or feature flags per environment. Property placeholders like ${VAR_NAME} can reference environment variables or system properties.
• Example: application.properties with environment variables like ${DB_URL}, ${JWT_SECRET} - these placeholders are resolved from environment variables at runtime, allowing the same codebase to work in different environments (local, staging, production) by setting different environment variables without changing code.

#### Spring Boot Basics
• Main application class, application.properties, and starter dependencies form the foundation. The main application class (annotated with @SpringBootApplication) is the entry point that bootstraps Spring. application.properties/application.yml holds configuration (database URLs, server ports, feature flags). Starter dependencies in pom.xml bring in all necessary libraries. Together, these three components enable a working Spring Boot application with minimal boilerplate.

#### Overview of Spring Boot Actuator
• Production-ready features for monitoring and managing Spring Boot applications. Actuator exposes operational information about your application (health, metrics, info, beans, configuration) through HTTP endpoints or JMX. It's essential for production monitoring - you can check if the app is healthy, see memory usage, database connection status, and even expose custom metrics. Security should be configured to protect sensitive endpoints.

#### Built-in Actuator Endpoints (health, info, metrics, etc.)
• Endpoints like /actuator/health, /actuator/info, /actuator/metrics for application monitoring. /actuator/health returns UP/DOWN status (can include database, disk space checks), /actuator/info returns custom application information, /actuator/metrics exposes application metrics (memory, thread count, HTTP requests), /actuator/env shows environment variables, /actuator/beans lists all Spring beans. These endpoints help with monitoring, debugging, and operations in production.

### Overview of Spring MVC & Architecture
• Model-View-Controller framework for building web applications with separation of concerns. MVC separates application into three layers: Model (data/entities), View (presentation layer, though with REST this is JSON/XML), and Controller (handles HTTP requests, coordinates between Model and View). This separation makes code more maintainable, testable, and allows different teams to work on different layers. Spring MVC uses DispatcherServlet as the front controller that routes requests to appropriate controllers.
• Example: Controllers handle requests (ExpenseController receives HTTP requests), Services contain business logic (ExpenseService processes data, validates, transforms), Models represent data (Expense, Report entities) - this clear separation means controllers stay thin, services are reusable, and models represent domain concepts.

#### Controllers and @Controller Annotation
• Classes that handle HTTP requests and return views or data; @Controller for MVC (returns view names resolved to HTML templates), @RestController for REST (combines @Controller + @ResponseBody, returns JSON/XML directly). Controllers map URLs to methods using @RequestMapping and HTTP method annotations. They should be thin - delegate business logic to services.
• Example: HelloController, ExpenseController, ReportController, AuthController all use @RestController - they handle HTTP requests, call service methods, and return DTOs that Spring automatically serializes to JSON, making them perfect for REST APIs that return data rather than HTML pages.

#### Annotations
• Metadata markers that provide instructions to the Spring framework about class/method behavior. Annotations are metadata added to Java code that don't change execution logic but provide information to frameworks, tools, or the compiler. Spring uses reflection to read annotations at runtime and configure beans, map requests, validate data, etc. They're declarative - you declare what you want (like @GetMapping("/users")) and Spring handles the implementation.

#### HTTP Method Annotations (@GetMapping, @PostMapping, etc.)
• Annotations mapping HTTP methods (GET, POST, PUT, DELETE) to controller methods. @GetMapping handles GET requests (retrieve data), @PostMapping handles POST (create resources), @PutMapping handles PUT (update entire resource), @PatchMapping handles PATCH (partial updates), @DeleteMapping handles DELETE (remove resources). They're shorthand for @RequestMapping with the method specified. They also set appropriate HTTP method semantics.
• Example: @GetMapping in HelloController, ExpenseController retrieves data (getAllExpenses, getById), @PostMapping in AuthController creates/login action (login endpoint), @PutMapping updates resources (ExpenseController.update, ReportController.update), @DeleteMapping removes resources (ExpenseController.delete, ReportController.delete) - each annotation maps to the appropriate HTTP verb for RESTful design.

#### Request Parameters and Path Variables
• @RequestParam for query parameters, @PathVariable for URL path segments. @RequestParam extracts query string parameters (like ?name=John), optional with defaultValue, useful for filtering/searching. @PathVariable extracts values from URL path segments (like /users/{id}), required by default, used for resource identifiers. Both automatically convert string values to method parameter types.
• Example: @RequestParam in HelloController.hello() extracts ?name=value from URL, ExpenseController.search() uses ?merchant=Walmart to filter expenses; @PathVariable in ExpenseController.getById(), update(), delete() extracts {id} from URLs like /api/expenses/123, identifying which expense to retrieve/update/delete - path variables are part of the resource path, query params are for optional filtering.

#### Request Body and @RequestBody Annotation
• @RequestBody binds HTTP request body to method parameters for POST/PUT requests. Spring automatically deserializes JSON/XML request body into Java objects (like DTOs) using Jackson. The Content-Type header determines the format. This is how clients send data to create or update resources. Spring validates and converts the request body to match your method parameter type.
• Example: @RequestBody used in ExpenseController.create() receives ExpenseWOIDDTO JSON from client to create new expense, ReportController.create() receives ReportDTO to create reports, AuthController.login() receives AuthRequest (username/password) JSON - in all cases, the HTTP request body (JSON) is automatically converted to the Java object parameter.

#### HTTP Status Code & Exception Handling with @ExceptionHandler
• @ResponseStatus sets HTTP status codes; @ExceptionHandler handles exceptions in controllers. @ResponseStatus on methods sets the HTTP status code returned (like 201 CREATED, 204 NO_CONTENT). @ExceptionHandler methods in controllers catch specific exceptions and return appropriate error responses. ResponseStatusException allows throwing exceptions with status codes programmatically. This ensures REST APIs return proper HTTP semantics (201 for created, 404 for not found, 400 for bad request).
• Example: @ResponseStatus(HttpStatus.CREATED) in ReportController.create() returns 201 when report is created, @ResponseStatus(HttpStatus.NO_CONTENT) in delete() returns 204 (success with no body); ResponseStatusException thrown in ExpenseService.getById() and ReportService.getById() with HttpStatus.NOT_FOUND when entities don't exist, automatically returning 404 to the client.

#### RESTful API Development with @RestController Annotation
• @RestController combines @Controller and @ResponseBody for REST APIs returning JSON/XML. RESTful APIs follow REST principles: resources identified by URLs, use HTTP methods correctly (GET/POST/PUT/DELETE), stateless communication, return JSON/XML. @RestController ensures all methods return response bodies (not view names) and Spring automatically serializes return values to JSON using Jackson. This is perfect for building APIs consumed by frontends or mobile apps.
• Example: All controllers (ExpenseController, ReportController, AuthController, HelloController) use @RestController - they return DTOs/objects that Spring automatically converts to JSON responses, follow REST conventions (/api/expenses for expense resource, /api/reports for reports), and use appropriate HTTP methods for CRUD operations.

#### Swagger UI Overview
• Interactive API documentation tool that generates UI from OpenAPI/Swagger specifications. Swagger/OpenAPI provides interactive documentation where developers can see all API endpoints, parameters, request/response schemas, and even test APIs directly from the browser. It auto-generates documentation from code annotations, keeping docs in sync with code. Essential for API consumers to understand available endpoints and data structures.

#### Implementing Swagger UI in Spring Boot
• Add springdoc-openapi dependency and configure Swagger UI endpoints. The springdoc-openapi library automatically scans @RestController classes and generates OpenAPI 3 documentation. It exposes Swagger UI at /swagger-ui.html and the OpenAPI JSON spec at /v3/api-docs. Minimal configuration needed - just add the dependency and optionally configure API info, security, or path filtering.
• Example: springdoc-openapi-starter-webmvc-ui dependency in pom.xml (accessible at /swagger-ui.html) - once added, Spring Boot automatically generates API documentation for all REST controllers, allowing developers to browse all endpoints (like /api/expenses, /api/reports), see request/response formats, and test API calls directly from the browser without writing client code.

### Hibernate Annotations
• JPA/Hibernate annotations for mapping Java classes to database tables and columns. These annotations define how Java objects map to relational database structures. @Entity marks a class as a database entity, @Table specifies the table name, @Id marks the primary key, @Column maps fields to columns, and relationship annotations (@OneToMany, @ManyToOne) define associations. This allows you to work with Java objects instead of SQL, with Hibernate generating SQL behind the scenes.
• Example: @Entity, @Table, @Id, @GeneratedValue, @Column, @OneToMany, @ManyToOne used in Expense, Report, AppUser models - Expense has @Entity and @Table(name="expenses"), @Id on expenseId with @GeneratedValue for auto-increment, @ManyToOne on report field linking to Report entity, @Column(name="expenseMerchant") customizes column mapping, creating the object-relational mapping automatically.

#### Hibernate Configuration
• Configuration via application.properties or persistence.xml for database connection and Hibernate settings. Configuration includes datasource (database URL, username, password), Hibernate properties (dialect, ddl-auto for schema management, show-sql for debugging), and JPA settings. application.properties is simpler for Spring Boot; persistence.xml is the standard JPA approach but more verbose. Key properties like ddl-auto control whether Hibernate creates/updates database schema automatically.
• Example: application.properties contains spring.jpa.hibernate.ddl-auto=update (automatically updates database schema when entities change) and datasource configuration (spring.datasource.url, username, password from environment variables) - this configures Hibernate to connect to the database and manage schema changes automatically during development.

#### Inheritance Hierarchies
• Mapping inheritance relationships (single table, joined, table per class) between entity classes. When entity classes inherit from each other, you need to map this to database tables. SINGLE_TABLE stores all subclasses in one table with a discriminator column, JOINED uses separate tables with joins, TABLE_PER_CLASS uses separate tables for each class. Each strategy has trade-offs in performance and data normalization. You specify this with @Inheritance(strategy=...).

#### HQL - Hibernate Query Language
• Object-oriented query language for Hibernate entities (not database tables). HQL uses entity names and properties instead of table/column names, making queries database-agnostic. You write queries like "FROM Expense e WHERE e.merchant = :merchant" instead of SQL "SELECT * FROM expenses WHERE expenseMerchant = ?". Hibernate translates HQL to SQL for your specific database. Useful for complex queries without native SQL.
• Example: Commented @Query in ExpenseRepository shows HQL syntax (though not actively used) - the commented line "@Query("SELECT * FROM expenses WHERE expenseMerchant = merchant")" demonstrates the concept, though actual HQL would use entity names like "FROM Expense WHERE expenseMerchant = :merchant" instead of table/column names.

#### JPQL - Java Persistence Query Language
• Java standard query language similar to HQL for JPA entities. JPQL is the JPA standard (part of Java EE/Jakarta EE) for querying entities, similar to HQL but standardized across JPA implementations. Like HQL, it uses entity and property names, is database-agnostic, and supports parameters. JPQL queries work with any JPA provider (Hibernate, EclipseLink, etc.), while HQL is Hibernate-specific. Both are very similar in syntax and usage.

#### Native Queries
• SQL queries written in native database syntax using @Query(nativeQuery = true). When HQL/JPQL can't express complex queries or you need database-specific features, you can write native SQL. Set nativeQuery=true in @Query annotation and write actual SQL. This loses database portability but gives you full SQL power. Useful for complex joins, database-specific functions, or when optimizing performance with hand-written SQL. Always be careful with SQL injection - use parameters.

#### Criteria API
• Type-safe, programmatic way to build queries dynamically. Instead of writing query strings, Criteria API lets you build queries using Java code with compile-time type checking. Useful when query structure depends on runtime conditions (different filters, sorting). You create CriteriaQuery objects, build predicates programmatically, and execute. More verbose than HQL but type-safe and flexible for dynamic queries. Reduces risk of typos and SQL injection since it's Java code, not strings.

#### Object Relational Mapping
• Technique mapping object-oriented domain models to relational database tables. ORM solves the "impedance mismatch" between object-oriented Java (objects, inheritance, references) and relational databases (tables, rows, foreign keys). It automatically converts between Java objects and database rows, handles relationships, manages transactions, and generates SQL. You work with Java objects, and ORM (like Hibernate) handles database operations. This reduces boilerplate JDBC code significantly.
• Example: Expense, Report, and AppUser entities map to database tables via JPA annotations - the Expense Java class automatically maps to an "expenses" table, its fields map to columns, the report relationship maps to a foreign key, and when you save an Expense object, Hibernate generates and executes INSERT SQL automatically, eliminating manual SQL/JDBC code.

#### Class vs. Schema
• Class represents Java entity; Schema represents database structure - ORM bridges the gap. In Java, you have classes with fields, methods, and inheritance. In databases, you have tables with columns, constraints, and foreign keys. These are fundamentally different models. ORM (like Hibernate) acts as a translator: when you save a Java object, it converts it to database rows; when you query, it converts rows back to objects. The mapping annotations define how this translation happens.
• Example: Expense class maps to "expenses" table; Report class maps to "reports" table - the Java Expense class has expenseId, expenseMerchant fields which map to expense_id, expense_merchant columns in the database table; the relationship between Expense and Report (expense.report field) maps to a foreign key column (reportId) in the expenses table, bridging object references to relational foreign keys.

#### Spring Data ORM Providers
• Spring Data JPA provides repository abstraction over JPA implementations (Hibernate, EclipseLink). Spring Data JPA sits on top of JPA providers (most commonly Hibernate) and adds repository abstraction. You define interfaces extending JpaRepository, and Spring automatically implements them with CRUD operations, query methods (findBy...), and pagination. This eliminates boilerplate DAO code - just define the interface, and Spring generates the implementation. It works with any JPA provider but most commonly uses Hibernate.
• Example: ExpenseRepository, ReportRepository, AppUserRepository extend JpaRepository - you define ExpenseRepository as an interface with just "List<Expense> findByExpenseMerchant(String merchant)", and Spring Data automatically implements all CRUD methods (save, findById, findAll, delete) plus your custom query method, generating the actual database code at runtime, no implementation class needed.

#### Hibernate Architecture & Caches
• Hibernate architecture includes SessionFactory, Session, and caching layers (first-level, second-level) for performance. SessionFactory is the heavyweight object that creates Sessions (one per application, expensive to create). Session represents a unit of work with the database (like a connection, but more - manages entity state, caching, transactions). First-level cache is per-session (automatic, reduces database queries within a transaction). Second-level cache is shared across sessions (optional, configurable, stores entities between transactions for better performance). Understanding this helps optimize performance and understand entity lifecycle states.