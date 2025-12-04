# Spring Boot Expense Report Application - Code Explanation

## Overview

This is a Spring Boot REST API application for managing expense reports. It follows a layered architecture pattern where requests flow from **Controllers** → **Services** → **Repositories** → **Database**. This document explains how Spring Boot works in the context of this application.

---

## Table of Contents

1. [Spring Boot Fundamentals](#spring-boot-fundamentals)
2. [Application Architecture](#application-architecture)
3. [Request Flow: Controller to Service](#request-flow-controller-to-service)
4. [Component Breakdown](#component-breakdown)
5. [Key Spring Boot Annotations](#key-spring-boot-annotations)
6. [Dependency Injection](#dependency-injection)

---

## Spring Boot Fundamentals

### What is Spring Boot?

Spring Boot is a framework built on top of the Spring Framework that simplifies Java application development by providing:
- **Auto-configuration**: Automatically configures beans based on dependencies
- **Embedded server**: Runs applications as standalone JARs with embedded Tomcat
- **Starter dependencies**: Pre-configured dependency sets for common use cases
- **Convention over configuration**: Sensible defaults reduce boilerplate code

### How Spring Boot Starts

When you run `ExpenseReportApplication.main()`, Spring Boot:

1. **Scans the package** (and sub-packages) for Spring components
2. **Creates an Application Context** - a container that manages all Spring beans
3. **Auto-configures** components based on dependencies (JPA, Web MVC, etc.)
4. **Starts the embedded Tomcat server** (default port 8080)
5. **Registers all controllers** and maps HTTP endpoints

---

## Application Architecture

This application follows a **3-tier architecture**:

```
┌─────────────────────────────────────────┐
│         Controller Layer                │  ← Handles HTTP requests/responses
│    (ExpenseController, HelloController) │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│          Service Layer                  │  ← Business logic
│         (ExpenseService)                │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│        Repository Layer                 │  ← Data access (JPA)
│      (ExpenseRepository)                │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│           Database (H2)                 │  ← Data persistence
└─────────────────────────────────────────┘
```

---

## Request Flow: Controller to Service

### Example: Getting All Expenses

Let's trace what happens when a client makes a `GET /api/expenses` request:

#### Step 1: HTTP Request Arrives
```
Client → GET http://localhost:8080/api/expenses
```

#### Step 2: Spring DispatcherServlet Routes Request
- Spring's `DispatcherServlet` (the front controller) receives the request
- It looks at the URL path: `/api/expenses`
- It finds `ExpenseController` because of `@RequestMapping("/api/expenses")`
- It matches the `@GetMapping` method (no additional path, so it matches the base path)

#### Step 3: Controller Method Executes
```java
@GetMapping // domain:port/api/expenses
public List<ExpenseDTO> getAllExpenses() {
    return service.getAllExpenses(); // Delegates to service layer
}
```

**What happens here:**
- Spring automatically converts the return value to JSON (via Jackson)
- The `service` field is **injected by Spring** via constructor injection
- The controller doesn't contain business logic - it delegates to the service

#### Step 4: Service Layer Processes Request
```java
public List<ExpenseDTO> getAllExpenses() {
    return repository.findAll().stream()
        .map(this::ExpenseToDto)
        .toList();
}
```

**What happens here:**
- Service calls the repository to get all `Expense` entities from the database
- Converts each `Expense` entity to an `ExpenseDTO` (Data Transfer Object)
- Returns a list of DTOs

**Why DTOs?**
- Entities contain database-specific annotations and relationships
- DTOs provide a clean API contract for clients
- Separates internal data model from external API

#### Step 5: Repository Accesses Database
```java
// ExpenseRepository extends JpaRepository<Expense, String>
repository.findAll() // JPA method - automatically implemented by Spring
```

**What happens here:**
- `JpaRepository` provides `findAll()` method automatically
- Spring Data JPA generates the implementation at runtime
- Executes SQL: `SELECT * FROM expenses`
- Maps database rows to `Expense` objects

#### Step 6: Response Flows Back
```
Database → Repository → Service → Controller → JSON Response → Client
```

---

## Component Breakdown

### 1. Main Application Class

**File:** `ExpenseReportApplication.java`

```java
@SpringBootApplication
public class ExpenseReportApplication {
    public static void main(String[] args) {
        SpringApplication.run(ExpenseReportApplication.class, args);
    }
}
```

**What `@SpringBootApplication` does:**
- Combines three annotations:
  - `@Configuration`: Marks this as a configuration class
  - `@EnableAutoConfiguration`: Enables Spring Boot auto-configuration
  - `@ComponentScan`: Scans for Spring components in this package and sub-packages

**CommandLineRunner Bean:**
```java
@Bean
CommandLineRunner seedData(ExpenseRepository repository) {
    return args -> {
        // Creates sample data when application starts
        repository.saveAll(List.of(e1, e2, e3));
    };
}
```

- `@Bean` tells Spring to manage this method's return value
- `CommandLineRunner` is executed after the application context is fully loaded
- Used here to seed initial data into the database

---

### 2. Controller Layer

**Purpose:** Handle HTTP requests and responses. Controllers are the entry point for all web requests.

#### ExpenseController

**Key Annotations:**
- `@RestController`: Combines `@Controller` + `@ResponseBody`
  - `@Controller`: Marks this as a Spring MVC controller
  - `@ResponseBody`: Automatically converts return values to JSON
- `@RequestMapping("/api/expenses")`: Base URL path for all methods in this controller

**HTTP Method Mappings:**

| Annotation | HTTP Method | Endpoint | Purpose |
|------------|-------------|----------|---------|
| `@GetMapping` | GET | `/api/expenses` | Get all expenses |
| `@GetMapping("/search")` | GET | `/api/expenses/search?merchant=Walmart` | Search by merchant |
| `@GetMapping("/{id}")` | GET | `/api/expenses/123` | Get expense by ID |
| `@PostMapping` | POST | `/api/expenses` | Create new expense |
| `@PutMapping("/{id}")` | PUT | `/api/expenses/123` | Update expense |
| `@DeleteMapping("/{id}")` | DELETE | `/api/expenses/123` | Delete expense |

**Parameter Annotations:**
- `@PathVariable`: Extracts value from URL path (e.g., `{id}` → `id` parameter)
- `@RequestParam`: Extracts query parameter (e.g., `?merchant=Walmart`)
- `@RequestBody`: Converts JSON request body to Java object

**Dependency Injection:**
```java
private final ExpenseService service;

public ExpenseController(ExpenseService service) {
    this.service = service; // Spring injects ExpenseService here
}
```

- Spring automatically provides an `ExpenseService` instance when creating the controller
- This is **constructor injection** - preferred method in Spring

#### HelloController

A simple example controller demonstrating:
- Basic GET endpoint
- Query parameter handling with default values
- String response (automatically converted to JSON or plain text)

---

### 3. Service Layer

**Purpose:** Contains business logic. Services orchestrate data operations and enforce business rules.

**File:** `ExpenseService.java`

**Key Annotation:**
- `@Service`: Marks this class as a Spring service component
  - Spring automatically detects and manages it
  - Can be injected into controllers via dependency injection

**Service Methods Explained:**

1. **getAllExpenses()**
   ```java
   return repository.findAll().stream()
       .map(this::ExpenseToDto)
       .toList();
   ```
   - Fetches all expenses from database
   - Converts entities to DTOs (hides internal structure)
   - Returns clean data transfer objects

2. **create(ExpenseWOIDDTO dto)**
   ```java
   Expense entity = new Expense(dto.expenseDate(), dto.expenseValue(), dto.expenseMerchant());
   return ExpenseToDto(repository.save(entity));
   ```
   - Converts DTO (without ID) to Entity
   - Saves to database (ID is auto-generated)
   - Returns DTO with generated ID

3. **update(String id, ExpenseDTO dto)**
   ```java
   Expense expense = repository.findById(id)
       .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
   expense.setDate(dto.expenseDate());
   // ... update fields
   return ExpenseToDto(repository.save(expense));
   ```
   - Finds existing expense or throws 404 error
   - Updates fields
   - Saves and returns updated DTO

4. **delete(String id)**
   ```java
   repository.deleteById(id);
   ```
   - Simple deletion operation
   - No return value (void)

**Why Use a Service Layer?**
- **Separation of concerns**: Controllers handle HTTP, services handle business logic
- **Reusability**: Service methods can be called from multiple controllers
- **Testability**: Easy to unit test business logic without HTTP layer
- **Transaction management**: Services can manage database transactions

---

### 4. Repository Layer

**Purpose:** Data access layer. Repositories abstract database operations.

**File:** `ExpenseRepository.java`

```java
public interface ExpenseRepository extends JpaRepository<Expense, String> {
    List<Expense> findByExpenseMerchant(String merchant);
}
```

**How Spring Data JPA Works:**

1. **Interface Extension:**
   - `JpaRepository<Expense, String>` provides:
     - `findAll()` - Get all records
     - `findById(id)` - Get by ID
     - `save(entity)` - Save or update
     - `deleteById(id)` - Delete by ID
     - And many more...

2. **Method Name Convention:**
   ```java
   List<Expense> findByExpenseMerchant(String merchant);
   ```
   - Spring automatically generates implementation based on method name
   - `findBy` + `ExpenseMerchant` → `SELECT * FROM expenses WHERE expenseMerchant = ?`
   - No implementation needed!

3. **Runtime Implementation:**
   - Spring creates a proxy implementation at runtime
   - You never write the actual database code
   - Spring handles SQL generation and entity mapping

**Benefits:**
- No boilerplate CRUD code
- Type-safe queries
- Automatic transaction management
- Easy to extend with custom queries

---

### 5. Model/Entity Layer

**Purpose:** Represent database tables as Java objects.

#### Expense Entity

**Key Annotations:**
- `@Entity`: Marks this class as a JPA entity (maps to database table)
- `@Table(name = "expenses")`: Specifies table name
- `@Id`: Marks primary key field
- `@GeneratedValue`: Auto-generates ID value
- `@Column(name = "expenseMerchant")`: Maps field to specific column
- `@ManyToOne`: Defines relationship to Report entity

**JPA (Java Persistence API):**
- Standard Java API for object-relational mapping
- Converts Java objects to database rows and vice versa
- Handles relationships between entities

#### Report Entity

- Demonstrates `@OneToMany` relationship
- One Report can have many Expenses
- Uses Lombok annotations (`@Data`, `@NoArgsConstructor`) for boilerplate reduction

---

### 6. DTOs (Data Transfer Objects)

**Purpose:** Transfer data between layers without exposing internal structure.

**ExpenseDTO:**
- Includes ID (for responses)
- Used when returning data to clients

**ExpenseWOIDDTO:**
- Without ID (for creating new expenses)
- Used when receiving data from clients (ID is generated by database)

**Why DTOs?**
- **Security**: Hide internal entity structure
- **Flexibility**: Can have different fields than entities
- **API Versioning**: Can change DTOs without changing entities
- **Performance**: Can exclude unnecessary fields/relationships

---

## Key Spring Boot Annotations

| Annotation | Purpose | Where Used |
|------------|---------|------------|
| `@SpringBootApplication` | Main application entry point | Main class |
| `@RestController` | Marks controller, auto JSON conversion | Controllers |
| `@RequestMapping` | Base URL path for controller | Controllers |
| `@GetMapping` | Maps GET requests | Controller methods |
| `@PostMapping` | Maps POST requests | Controller methods |
| `@PutMapping` | Maps PUT requests | Controller methods |
| `@DeleteMapping` | Maps DELETE requests | Controller methods |
| `@PathVariable` | Extract URL path variable | Method parameters |
| `@RequestParam` | Extract query parameter | Method parameters |
| `@RequestBody` | Convert JSON to Java object | Method parameters |
| `@Service` | Marks service component | Service classes |
| `@Entity` | Marks JPA entity | Model classes |
| `@Id` | Marks primary key | Entity fields |
| `@GeneratedValue` | Auto-generate ID | Entity fields |
| `@Bean` | Register method return as Spring bean | Configuration methods |

---

## Dependency Injection

### How It Works

Spring uses **Dependency Injection (DI)** to manage object creation and wiring.

**Example from ExpenseController:**
```java
public ExpenseController(ExpenseService service) {
    this.service = service; // Spring provides this automatically
}
```

**What Spring Does:**
1. Scans for `@Service` annotated classes
2. Creates a single instance (singleton) of `ExpenseService`
3. When creating `ExpenseController`, sees it needs `ExpenseService`
4. Injects the `ExpenseService` instance into the constructor

**Benefits:**
- **Loose coupling**: Classes don't create their own dependencies
- **Testability**: Easy to inject mock objects for testing
- **Single responsibility**: Objects focus on their own logic
- **Centralized management**: Spring manages object lifecycle

### Dependency Chain

```
ExpenseController
    ↓ depends on
ExpenseService
    ↓ depends on
ExpenseRepository
    ↓ depends on
JpaRepository (provided by Spring Data JPA)
    ↓ depends on
EntityManager (provided by Spring/JPA)
    ↓ connects to
Database (H2)
```

Spring automatically wires this entire chain together!

---

## Summary: Complete Request Flow

**Example: Creating a New Expense**

1. **Client sends POST request:**
   ```
   POST /api/expenses
   Body: {"expenseDate": "2024-01-15", "expenseValue": 50.00, "expenseMerchant": "Target"}
   ```

2. **Spring DispatcherServlet:**
   - Routes to `ExpenseController.create()`

3. **Controller:**
   - `@RequestBody` converts JSON to `ExpenseWOIDDTO`
   - Calls `service.create(dto)`

4. **Service:**
   - Creates new `Expense` entity from DTO
   - Calls `repository.save(entity)`

5. **Repository:**
   - JPA generates SQL: `INSERT INTO expenses ...`
   - Database generates ID
   - Returns saved entity with ID

6. **Service:**
   - Converts entity to `ExpenseDTO` (includes ID)
   - Returns DTO

7. **Controller:**
   - Returns DTO (Spring converts to JSON)

8. **Response:**
   ```
   HTTP 200 OK
   Body: {"expenseId": "abc123", "expenseDate": "2024-01-15", ...}
   ```

---

## Key Takeaways

1. **Spring Boot auto-configures** most things based on dependencies
2. **Controllers** handle HTTP, delegate to services
3. **Services** contain business logic, use repositories
4. **Repositories** access data, use JPA for database operations
5. **Dependency Injection** wires everything together automatically
6. **Annotations** tell Spring how to configure and manage components
7. **DTOs** separate internal models from external API contracts

This architecture provides **separation of concerns**, **testability**, and **maintainability** - key principles of good software design!

