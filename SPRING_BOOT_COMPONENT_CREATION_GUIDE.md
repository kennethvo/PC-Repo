# Spring Boot Component Creation - Comprehensive Study Guide

## 🎯 **OVERVIEW**

This guide breaks down Spring Boot component creation step-by-step using examples from your codebase. Master these patterns to confidently complete Spring Boot exercises in your assessment.

**Reference Files:**
- `W6/ExpenseReport/src/main/java/com/revature/ExpenseReport/Controller/ExpenseController.java` - REST Controller
- `W6/ExpenseReport/src/main/java/com/revature/ExpenseReport/Service/ExpenseService.java` - Service Layer
- `W6/ExpenseReport/src/main/java/com/revature/ExpenseReport/Repository/ExpenseRepository.java` - Repository Interface
- `W6/ExpenseReport/src/main/java/com/revature/ExpenseReport/Model/Expense.java` - Entity Class
- `W6/ExpenseReport/src/main/java/com/revature/ExpenseReport/ExpenseReportApplication.java` - Main Application
- `W6/ExpenseReport/src/main/java/com/revature/ExpenseReport/WebConfig.java` - Configuration Class

---

## 📋 **LAYERED ARCHITECTURE - THE BIG PICTURE**

```
┌─────────────────────────────────────┐
│      Controller Layer               │  ← Handles HTTP requests
│   (@RestController, @GetMapping)   │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│        Service Layer                 │  ← Business logic
│         (@Service)                    │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│      Repository Layer                │  ← Data access
│  (extends JpaRepository)             │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│         Database                      │
└─────────────────────────────────────┘
```

**Data Flow:**
1. **HTTP Request** → Controller receives it
2. **Controller** → Calls Service method
3. **Service** → Calls Repository method
4. **Repository** → Queries Database
5. **Response flows back** → Repository → Service → Controller → HTTP Response

---

## 🔑 **STEP 1: UNDERSTANDING ANNOTATIONS**

### **Essential Spring Boot Annotations:**

| Annotation | Purpose | Where Used |
|------------|---------|------------|
| `@SpringBootApplication` | Main application class | Main class |
| `@RestController` | REST API controller | Controller classes |
| `@Service` | Business logic layer | Service classes |
| `@Repository` | Data access layer | Repository interfaces |
| `@Entity` | Database entity | Model/Entity classes |
| `@Configuration` | Configuration class | Config classes |
| `@Bean` | Creates a bean | Methods in @Configuration or main class |
| `@RequestMapping` | Base URL mapping | Controller classes |
| `@GetMapping` | GET endpoint | Controller methods |
| `@PostMapping` | POST endpoint | Controller methods |
| `@PutMapping` | PUT endpoint | Controller methods |
| `@DeleteMapping` | DELETE endpoint | Controller methods |
| `@PathVariable` | URL path variable | Method parameters |
| `@RequestParam` | Query parameter | Method parameters |
| `@RequestBody` | Request body (JSON) | Method parameters |
| `@ResponseStatus` | HTTP status code | Controller methods |
| `@Id` | Primary key | Entity fields |
| `@GeneratedValue` | Auto-generate ID | Entity fields |
| `@Column` | Column mapping | Entity fields |
| `@ManyToOne` | Many-to-one relationship | Entity fields |
| `@OneToMany` | One-to-many relationship | Entity fields |

---

## 🔑 **STEP 2: CREATING A CONTROLLER**

### **Controller Structure:**

**Reference**: `W6/ExpenseReport/src/main/java/com/revature/ExpenseReport/Controller/ExpenseController.java`

```java
package com.revature.ExpenseReport.Controller;

import com.revature.ExpenseReport.Service.ExpenseService;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController                    // Marks as REST controller (returns JSON)
@RequestMapping("/api/expenses")  // Base URL: /api/expenses
public class ExpenseController {
    
    // 1. Field - Service dependency
    private final ExpenseService service;
    
    // 2. Constructor - Dependency injection
    public ExpenseController(ExpenseService service) {
        this.service = service;
    }
    
    // 3. Methods - HTTP endpoints
    
    // GET /api/expenses
    @GetMapping
    public List<ExpenseDTO> getAllExpenses() {
        return service.getAllExpenses();
    }
    
    // GET /api/expenses/{id}
    @GetMapping("/{id}")
    public ExpenseDTO getById(@PathVariable String id) {
        return service.getById(id);
    }
    
    // POST /api/expenses
    @PostMapping
    public ExpenseDTO create(@RequestBody ExpenseWOIDDTO dto) {
        return service.create(dto);
    }
    
    // PUT /api/expenses/{id}
    @PutMapping("/{id}")
    public ExpenseDTO update(@PathVariable String id, @RequestBody ExpenseDTO dto) {
        return service.update(id, dto);
    }
    
    // DELETE /api/expenses/{id}
    @DeleteMapping("/{id}")
    public void delete(@PathVariable String id) {
        service.delete(id);
    }
}
```

### **Controller Patterns:**

**1. Basic Controller Structure:**
```java
@RestController
@RequestMapping("/api/resource")
public class ResourceController {
    private final ResourceService service;
    
    public ResourceController(ResourceService service) {
        this.service = service;
    }
    
    // Endpoint methods here
}
```

**2. GET Endpoints:**
```java
// Get all
@GetMapping
public List<ResourceDTO> getAll() {
    return service.getAll();
}

// Get by ID (path variable)
@GetMapping("/{id}")
public ResourceDTO getById(@PathVariable String id) {
    return service.getById(id);
}

// Get with query parameter
@GetMapping("/search")
public List<ResourceDTO> search(@RequestParam String name) {
    return service.searchByName(name);
}
```

**3. POST Endpoint (Create):**
```java
@PostMapping
public ResourceDTO create(@RequestBody ResourceDTO dto) {
    return service.create(dto);
}
```

**4. PUT Endpoint (Update):**
```java
@PutMapping("/{id}")
public ResourceDTO update(@PathVariable String id, @RequestBody ResourceDTO dto) {
    return service.update(id, dto);
}
```

**5. DELETE Endpoint:**
```java
@DeleteMapping("/{id}")
public void delete(@PathVariable String id) {
    service.delete(id);
}
```

### **Endpoint Parameters:**

**@PathVariable** - Extracts from URL path:
```java
// URL: GET /api/expenses/123
@GetMapping("/{id}")
public ExpenseDTO getById(@PathVariable String id) {
    // id = "123"
    return service.getById(id);
}
```

**@RequestParam** - Extracts from query string:
```java
// URL: GET /api/expenses/search?merchant=Walmart
@GetMapping("/search")
public List<ExpenseDTO> search(@RequestParam String merchant) {
    // merchant = "Walmart"
    return service.searchByMerchant(merchant);
}
```

**@RequestBody** - Converts JSON to Java object:
```java
// POST /api/expenses
// Body: {"expenseDate": "2024-01-15", "expenseValue": 50.00}
@PostMapping
public ExpenseDTO create(@RequestBody ExpenseDTO dto) {
    // Spring automatically converts JSON to ExpenseDTO
    return service.create(dto);
}
```

### **ResponseEntity and Status Codes:**

**Reference**: `W6/ExpenseReport/src/main/java/com/revature/ExpenseReport/Controller/ReportController.java` (lines 31-35, 42-45)

```java
// Using @ResponseStatus
@PostMapping
@ResponseStatus(HttpStatus.CREATED)  // Sets status to 201
public ReportDTO create(@RequestBody ReportDTO report) {
    return service.create(report);
}

// Using ResponseEntity (more control)
@PostMapping
public ResponseEntity<ReportDTO> create(@RequestBody ReportDTO report) {
    ReportDTO created = service.create(report);
    return ResponseEntity.status(HttpStatus.CREATED).body(created);
}

@DeleteMapping("/{id}")
@ResponseStatus(HttpStatus.NO_CONTENT)  // Sets status to 204
public void delete(@PathVariable String id) {
    service.delete(id);
}
```

**ResponseEntity Methods:**
- `ResponseEntity.ok(body)` - 200 OK
- `ResponseEntity.status(HttpStatus.CREATED).body(body)` - 201 Created
- `ResponseEntity.noContent().build()` - 204 No Content
- `ResponseEntity.notFound().build()` - 404 Not Found

---

## 🔑 **STEP 3: CREATING A SERVICE**

### **Service Structure:**

**Reference**: `W6/ExpenseReport/src/main/java/com/revature/ExpenseReport/Service/ExpenseService.java`

```java
package com.revature.ExpenseReport.Service;

import com.revature.ExpenseReport.Controller.ExpenseDTO;
import com.revature.ExpenseReport.Model.Expense;
import com.revature.ExpenseReport.Repository.ExpenseRepository;
import org.springframework.stereotype.Service;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;
import java.util.List;
import java.util.Optional;

@Service  // Marks as service layer
public class ExpenseService {
    
    // 1. Field - Repository dependency
    private final ExpenseRepository repository;
    
    // 2. Constructor - Dependency injection
    public ExpenseService(ExpenseRepository repository) {
        this.repository = repository;
    }
    
    // 3. Methods - Business logic
    
    // Get all expenses
    public List<ExpenseDTO> getAllExpenses() {
        return repository.findAll().stream()
            .map(this::ExpenseToDto)  // Convert entity to DTO
            .toList();
    }
    
    // Get by ID
    public ExpenseDTO getById(String id) {
        Optional<Expense> result = repository.findById(id);
        return result.isEmpty() ? null : ExpenseToDto(result.get());
    }
    
    // Create expense
    public ExpenseDTO create(ExpenseWOIDDTO dto) {
        // Convert DTO to Entity
        Expense entity = new Expense(
            dto.expenseDate(), 
            dto.expenseValue(), 
            dto.expenseMerchant()
        );
        // Save to database
        Expense saved = repository.save(entity);
        // Convert back to DTO
        return ExpenseToDto(saved);
    }
    
    // Update expense
    public ExpenseDTO update(String id, ExpenseDTO dto) {
        // Find entity or throw exception
        Expense expense = repository.findById(id)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
        
        // Update fields
        expense.setDate(dto.expenseDate());
        expense.setValue(dto.expenseValue());
        expense.setMerchant(dto.expenseMerchant());
        
        // Save and convert to DTO
        return ExpenseToDto(repository.save(expense));
    }
    
    // Delete expense
    public void delete(String id) {
        repository.deleteById(id);
    }
    
    // Helper method - Convert Entity to DTO
    private ExpenseDTO ExpenseToDto(Expense expense) {
        return new ExpenseDTO(
            expense.getId(),
            expense.getDate(),
            expense.getValue(),
            expense.getMerchant()
        );
    }
}
```

### **Service Patterns:**

**1. Basic Service Structure:**
```java
@Service
public class ResourceService {
    private final ResourceRepository repository;
    
    public ResourceService(ResourceRepository repository) {
        this.repository = repository;
    }
    
    // Business logic methods here
}
```

**2. Get All Pattern:**
```java
public List<ResourceDTO> getAll() {
    return repository.findAll().stream()
        .map(this::toDTO)
        .toList();
}
```

**3. Get By ID Pattern:**
```java
public ResourceDTO getById(String id) {
    Optional<Resource> result = repository.findById(id);
    return result.isEmpty() ? null : toDTO(result.get());
}

// Or with exception:
public ResourceDTO getById(String id) {
    Resource resource = repository.findById(id)
        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
    return toDTO(resource);
}
```

**4. Create Pattern:**
```java
public ResourceDTO create(ResourceDTO dto) {
    Resource entity = new Resource(dto.field1(), dto.field2());
    Resource saved = repository.save(entity);
    return toDTO(saved);
}
```

**5. Update Pattern:**
```java
public ResourceDTO update(String id, ResourceDTO dto) {
    Resource resource = repository.findById(id)
        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
    
    resource.setField1(dto.field1());
    resource.setField2(dto.field2());
    
    return toDTO(repository.save(resource));
}
```

**6. Delete Pattern:**
```java
public void delete(String id) {
    repository.deleteById(id);
}
```

**7. Entity to DTO Conversion:**
```java
private ResourceDTO toDTO(Resource resource) {
    return new ResourceDTO(
        resource.getId(),
        resource.getField1(),
        resource.getField2()
    );
}
```

---

## 🔑 **STEP 4: CREATING A REPOSITORY**

### **Repository Structure:**

**Reference**: `W6/ExpenseReport/src/main/java/com/revature/ExpenseReport/Repository/ExpenseRepository.java`

```java
package com.revature.ExpenseReport.Repository;

import com.revature.ExpenseReport.Model.Expense;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ExpenseRepository extends JpaRepository<Expense, String> {
    // JpaRepository provides:
    // - save(Expense) → Saves entity
    // - findById(String) → Finds by ID
    // - findAll() → Finds all
    // - deleteById(String) → Deletes by ID
    // - count() → Counts entities
    
    // Custom query method
    // Spring generates: SELECT * FROM expenses WHERE expenseMerchant = ?
    List<Expense> findByExpenseMerchant(String merchant);
}
```

### **Repository Patterns:**

**1. Basic Repository:**
```java
public interface ResourceRepository extends JpaRepository<Resource, String> {
    // JpaRepository<EntityType, IDType>
    // First parameter: Entity class
    // Second parameter: ID type
}
```

**2. Custom Query Methods:**
Spring generates SQL from method names:

```java
// findByFieldName → WHERE fieldName = ?
List<Expense> findByExpenseMerchant(String merchant);

// findByFieldNameGreaterThan → WHERE fieldName > ?
List<Expense> findByExpenseValueGreaterThan(BigDecimal amount);

// findByField1AndField2 → WHERE field1 = ? AND field2 = ?
List<Expense> findByExpenseMerchantAndExpenseValueGreaterThan(
    String merchant, BigDecimal amount);

// findByFieldNameContaining → WHERE fieldName LIKE %?%
List<Expense> findByExpenseMerchantContaining(String search);
```

**Naming Convention:**
- `findBy` + FieldName → `WHERE fieldName = ?`
- `findBy` + FieldName + `GreaterThan` → `WHERE fieldName > ?`
- `findBy` + Field1 + `And` + Field2 → `WHERE field1 = ? AND field2 = ?`
- `findBy` + FieldName + `Containing` → `WHERE fieldName LIKE %?%`

---

## 🔑 **STEP 5: CREATING AN ENTITY**

### **Entity Structure:**

**Reference**: `W6/ExpenseReport/src/main/java/com/revature/ExpenseReport/Model/Expense.java`

```java
package com.revature.ExpenseReport.Model;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;

@Entity                    // Marks as JPA entity
@Table(name = "expenses")  // Table name in database
public class Expense {
    
    // 1. Fields with annotations
    
    @Id                     // Primary key
    @GeneratedValue         // Auto-generate ID
    private String expenseId;
    
    @Column(name = "expenseMerchant")  // Column name mapping
    private String expenseMerchant;
    
    private LocalDate expenseDate;     // Column name inferred: expense_date
    private BigDecimal expenseValue;
    
    // 2. Relationships
    @ManyToOne              // Many expenses belong to one report
    @JoinColumn(name = "reportId")  // Foreign key column
    private Report report;
    
    // 3. Constructors
    public Expense() {}  // No-argument constructor (required by JPA)
    
    public Expense(LocalDate date, BigDecimal value, String merchant) {
        this.expenseDate = date;
        this.expenseValue = value;
        this.expenseMerchant = merchant;
    }
    
    // 4. Getters and Setters
    public String getId() { return expenseId; }
    public void setId(String id) { this.expenseId = id; }
    
    public LocalDate getDate() { return expenseDate; }
    public void setDate(LocalDate date) { this.expenseDate = date; }
    
    // ... other getters and setters
}
```

### **Entity Patterns:**

**1. Basic Entity:**
```java
@Entity
@Table(name = "resources")
public class Resource {
    @Id
    @GeneratedValue
    private String id;
    
    private String name;
    private BigDecimal price;
    
    // Constructors, getters, setters
}
```

**2. Entity with Lombok:**
```java
@Entity
@Table(name = "resources")
@Data              // Generates getters, setters, toString, equals, hashCode
@NoArgsConstructor // Generates no-argument constructor
public class Resource {
    @Id
    @GeneratedValue
    private String id;
    
    private String name;
    private BigDecimal price;
    // No need to write getters/setters!
}
```

**3. Entity Relationships:**

**Many-to-One:**
```java
@Entity
public class Expense {
    @Id
    @GeneratedValue
    private String id;
    
    @ManyToOne              // Many expenses → one report
    @JoinColumn(name = "reportId")  // Foreign key column
    private Report report;
}
```

**One-to-Many:**
```java
@Entity
public class Report {
    @Id
    @GeneratedValue
    private String id;
    
    @OneToMany(mappedBy = "report")  // "report" is field name in Expense
    private List<Expense> expenses = new ArrayList<>();
}
```

**4. Column Mapping:**
```java
@Column(name = "expenseMerchant")  // Explicit column name
private String expenseMerchant;

private LocalDate expenseDate;  // Column name inferred: expense_date
```

---

## 🔑 **STEP 6: CREATING BEANS**

### **Bean Creation:**

**Reference**: `W6/ExpenseReport/src/main/java/com/revature/ExpenseReport/ExpenseReportApplication.java` (lines 27-30, 33-59)

```java
@SpringBootApplication
public class ExpenseReportApplication {
    
    public static void main(String[] args) {
        SpringApplication.run(ExpenseReportApplication.class, args);
    }
    
    // Create a bean
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
    
    // Create a CommandLineRunner bean (runs after app starts)
    @Bean
    CommandLineRunner seedData(
        ExpenseRepository expenseRepository,
        ReportRepository reportRepository,
        PasswordEncoder encoder
    ) {
        return args -> {
            // Code that runs after application starts
            var expense = new Expense(LocalDate.now(), new BigDecimal(50.00), "Walmart");
            expenseRepository.save(expense);
        };
    }
}
```

### **Bean Patterns:**

**1. Simple Bean:**
```java
@Bean
public MyService myService() {
    return new MyService();
}
```

**2. Bean with Dependencies:**
```java
@Bean
public MyService myService(MyRepository repository) {
    // Parameters are automatically injected
    return new MyService(repository);
}
```

**3. CommandLineRunner Bean:**
```java
@Bean
CommandLineRunner initData(MyRepository repository) {
    return args -> {
        // Runs after application starts
        repository.save(new MyEntity("data"));
    };
}
```

---

## 🔑 **STEP 7: CREATING CONFIGURATION CLASSES**

### **Configuration Class Structure:**

**Reference**: `W6/ExpenseReport/src/main/java/com/revature/ExpenseReport/WebConfig.java`

```java
package com.revature.ExpenseReport;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration  // Marks as configuration class
public class WebConfig implements WebMvcConfigurer {
    
    private final JwtInterceptor jwtInterceptor;
    
    public WebConfig(JwtInterceptor jwtInterceptor) {
        this.jwtInterceptor = jwtInterceptor;
    }
    
    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(jwtInterceptor)
            .addPathPatterns("/api/**")
            .excludePathPatterns("/api/hello", "/api/auth/login");
    }
}
```

### **Configuration Patterns:**

**1. Basic Configuration:**
```java
@Configuration
public class AppConfig {
    // Can contain @Bean methods
    // Can implement interfaces like WebMvcConfigurer
}
```

**2. Configuration with Beans:**
```java
@Configuration
public class AppConfig {
    @Bean
    public MyService myService() {
        return new MyService();
    }
}
```

---

## 🔑 **STEP 8: CREATING DTOS (DATA TRANSFER OBJECTS)**

### **DTO Structure:**

**Reference**: `W6/ExpenseReport/src/main/java/com/revature/ExpenseReport/Controller/ExpenseDTO.java`

```java
package com.revature.ExpenseReport.Controller;

import java.math.BigDecimal;
import java.time.LocalDate;

// Java Record (simplified DTO)
public record ExpenseDTO(
    String expenseId,
    LocalDate expenseDate,
    BigDecimal expenseValue,
    String expenseMerchant
) {}

// Traditional DTO class
public class ExpenseDTO {
    private String expenseId;
    private LocalDate expenseDate;
    private BigDecimal expenseValue;
    private String expenseMerchant;
    
    // Constructor
    public ExpenseDTO(String expenseId, LocalDate expenseDate, 
                     BigDecimal expenseValue, String expenseMerchant) {
        this.expenseId = expenseId;
        this.expenseDate = expenseDate;
        this.expenseValue = expenseValue;
        this.expenseMerchant = expenseMerchant;
    }
    
    // Getters
    public String getExpenseId() { return expenseId; }
    public LocalDate getExpenseDate() { return expenseDate; }
    // ... other getters
}
```

### **DTO Patterns:**

**1. Record DTO (Java 14+):**
```java
public record ResourceDTO(
    String id,
    String name,
    BigDecimal price
) {}
```

**2. Traditional DTO:**
```java
public class ResourceDTO {
    private String id;
    private String name;
    
    public ResourceDTO(String id, String name) {
        this.id = id;
        this.name = name;
    }
    
    // Getters
    public String getId() { return id; }
    public String getName() { return name; }
}
```

**3. DTO Without ID (for Create operations):**
```java
public record ResourceWOIDDTO(
    String name,
    BigDecimal price
) {}
```

---

## 📝 **ASSESSMENT-STYLE PRACTICE QUESTIONS**

### **Question 1: Complete a Controller**

**Given:**
```java
@RestController
@RequestMapping("/api/users")
public class UserController {
    private final UserService service;
    
    public UserController(UserService service) {
        this.service = service;
    }
    
    // YOUR CODE HERE
    // 1. Complete GET endpoint to get all users
    // 2. Complete GET endpoint to get user by ID
    // 3. Complete POST endpoint to create user
    // 4. Complete PUT endpoint to update user
    // 5. Complete DELETE endpoint to delete user
}
```

**Answer:**
```java
@RestController
@RequestMapping("/api/users")
public class UserController {
    private final UserService service;
    
    public UserController(UserService service) {
        this.service = service;
    }
    
    // 1. Get all users
    @GetMapping
    public List<UserDTO> getAll() {
        return service.getAll();
    }
    
    // 2. Get user by ID
    @GetMapping("/{id}")
    public UserDTO getById(@PathVariable String id) {
        return service.getById(id);
    }
    
    // 3. Create user
    @PostMapping
    public UserDTO create(@RequestBody UserDTO dto) {
        return service.create(dto);
    }
    
    // 4. Update user
    @PutMapping("/{id}")
    public UserDTO update(@PathVariable String id, @RequestBody UserDTO dto) {
        return service.update(id, dto);
    }
    
    // 5. Delete user
    @DeleteMapping("/{id}")
    public void delete(@PathVariable String id) {
        service.delete(id);
    }
}
```

---

### **Question 2: Complete a Service Method**

**Given:**
```java
@Service
public class ProductService {
    private final ProductRepository repository;
    
    public ProductService(ProductRepository repository) {
        this.repository = repository;
    }
    
    // YOUR CODE HERE
    // Complete this method to get all products
    // Convert entities to DTOs
    public List<ProductDTO> getAll() {
        // YOUR CODE HERE
    }
    
    // YOUR CODE HERE
    // Complete this method to get product by ID
    // Return null if not found
    public ProductDTO getById(String id) {
        // YOUR CODE HERE
    }
    
    // Helper method provided
    private ProductDTO toDTO(Product product) {
        return new ProductDTO(product.getId(), product.getName(), product.getPrice());
    }
}
```

**Answer:**
```java
// Get all products
public List<ProductDTO> getAll() {
    return repository.findAll().stream()
        .map(this::toDTO)
        .toList();
}

// Get product by ID
public ProductDTO getById(String id) {
    Optional<Product> result = repository.findById(id);
    return result.isEmpty() ? null : toDTO(result.get());
}
```

---

### **Question 3: Complete a Service Create Method**

**Given:**
```java
@Service
public class OrderService {
    private final OrderRepository repository;
    
    public OrderService(OrderRepository repository) {
        this.repository = repository;
    }
    
    // YOUR CODE HERE
    // Complete this method to create an order
    // 1. Convert OrderDTO to Order entity
    // 2. Save entity to repository
    // 3. Convert saved entity back to DTO
    // 4. Return DTO
    public OrderDTO create(OrderDTO dto) {
        // YOUR CODE HERE
    }
    
    // Helper method provided
    private OrderDTO toDTO(Order order) {
        return new OrderDTO(order.getId(), order.getTotal(), order.getDate());
    }
}
```

**Answer:**
```java
public OrderDTO create(OrderDTO dto) {
    // 1. Convert DTO to Entity
    Order entity = new Order(dto.getTotal(), dto.getDate());
    
    // 2. Save to repository
    Order saved = repository.save(entity);
    
    // 3. Convert back to DTO
    return toDTO(saved);
}
```

---

### **Question 4: Complete a Service Update Method**

**Given:**
```java
@Service
public class ProductService {
    private final ProductRepository repository;
    
    // YOUR CODE HERE
    // Complete this method to update a product
    // 1. Find product by ID (throw exception if not found)
    // 2. Update product fields from DTO
    // 3. Save updated product
    // 4. Convert to DTO and return
    public ProductDTO update(String id, ProductDTO dto) {
        // YOUR CODE HERE
    }
}
```

**Answer:**
```java
public ProductDTO update(String id, ProductDTO dto) {
    // 1. Find product or throw exception
    Product product = repository.findById(id)
        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
    
    // 2. Update fields
    product.setName(dto.getName());
    product.setPrice(dto.getPrice());
    
    // 3. Save and convert to DTO
    return toDTO(repository.save(product));
}
```

---

### **Question 5: Complete a Repository Interface**

**Given:**
```java
// YOUR CODE HERE
// Complete this repository interface
// 1. Extend JpaRepository with Product entity and String ID
// 2. Add custom method to find by name
// 3. Add custom method to find products with price greater than amount

public interface ProductRepository {
    // YOUR CODE HERE
}
```

**Answer:**
```java
public interface ProductRepository extends JpaRepository<Product, String> {
    // Custom query method - Spring generates: WHERE name = ?
    List<Product> findByName(String name);
    
    // Custom query method - Spring generates: WHERE price > ?
    List<Product> findByPriceGreaterThan(BigDecimal amount);
}
```

---

### **Question 6: Complete an Entity Class**

**Given:**
```java
// YOUR CODE HERE
// Complete this entity class
// 1. Add @Entity and @Table annotations
// 2. Add @Id and @GeneratedValue for id field
// 3. Add @Column annotation for name field
// 4. Add no-argument constructor
// 5. Add constructor with fields
// 6. Add getters and setters

public class Product {
    // YOUR CODE HERE
    private String id;
    private String name;
    private BigDecimal price;
}
```

**Answer:**
```java
@Entity
@Table(name = "products")
public class Product {
    @Id
    @GeneratedValue
    private String id;
    
    @Column(name = "productName")
    private String name;
    
    private BigDecimal price;
    
    // No-argument constructor (required by JPA)
    public Product() {}
    
    // Constructor with fields
    public Product(String name, BigDecimal price) {
        this.name = name;
        this.price = price;
    }
    
    // Getters and setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    
    public BigDecimal getPrice() { return price; }
    public void setPrice(BigDecimal price) { this.price = price; }
}
```

---

### **Question 7: Complete Controller with Query Parameter**

**Given:**
```java
@RestController
@RequestMapping("/api/products")
public class ProductController {
    private final ProductService service;
    
    public ProductController(ProductService service) {
        this.service = service;
    }
    
    // YOUR CODE HERE
    // Complete GET endpoint with query parameter
    // URL: GET /api/products/search?name=Widget
    // Should call service.searchByName(name)
    @GetMapping("/search")
    public List<ProductDTO> search(/* YOUR CODE HERE */) {
        // YOUR CODE HERE
    }
}
```

**Answer:**
```java
@GetMapping("/search")
public List<ProductDTO> search(@RequestParam String name) {
    return service.searchByName(name);
}
```

---

### **Question 8: Complete Controller with ResponseEntity**

**Given:**
```java
@RestController
@RequestMapping("/api/orders")
public class OrderController {
    private final OrderService service;
    
    public OrderController(OrderService service) {
        this.service = service;
    }
    
    // YOUR CODE HERE
    // Complete POST endpoint that returns 201 Created status
    // Use ResponseEntity
    @PostMapping
    public ResponseEntity<OrderDTO> create(@RequestBody OrderDTO dto) {
        // YOUR CODE HERE
    }
    
    // YOUR CODE HERE
    // Complete GET endpoint that returns 404 if not found
    // Use ResponseEntity
    @GetMapping("/{id}")
    public ResponseEntity<OrderDTO> getById(@PathVariable String id) {
        // YOUR CODE HERE
    }
}
```

**Answer:**
```java
@PostMapping
public ResponseEntity<OrderDTO> create(@RequestBody OrderDTO dto) {
    OrderDTO created = service.create(dto);
    return ResponseEntity.status(HttpStatus.CREATED).body(created);
}

@GetMapping("/{id}")
public ResponseEntity<OrderDTO> getById(@PathVariable String id) {
    OrderDTO order = service.getById(id);
    if (order == null) {
        return ResponseEntity.notFound().build();
    }
    return ResponseEntity.ok(order);
}
```

---

### **Question 9: Complete Bean Creation**

**Given:**
```java
@SpringBootApplication
public class MyApplication {
    public static void main(String[] args) {
        SpringApplication.run(MyApplication.class, args);
    }
    
    // YOUR CODE HERE
    // Create a bean for MyService
    // Method should return new MyService()
    @Bean
    public MyService myService() {
        // YOUR CODE HERE
    }
    
    // YOUR CODE HERE
    // Create a CommandLineRunner bean that seeds data
    // Should save a Product with name "Test" and price 10.00
    @Bean
    CommandLineRunner seedData(ProductRepository repository) {
        // YOUR CODE HERE
    }
}
```

**Answer:**
```java
@Bean
public MyService myService() {
    return new MyService();
}

@Bean
CommandLineRunner seedData(ProductRepository repository) {
    return args -> {
        Product product = new Product("Test", new BigDecimal("10.00"));
        repository.save(product);
    };
}
```

---

### **Question 10: Complete Entity with Relationship**

**Given:**
```java
@Entity
@Table(name = "orders")
public class Order {
    @Id
    @GeneratedValue
    private String id;
    
    private BigDecimal total;
    
    // YOUR CODE HERE
    // Add @ManyToOne relationship to Customer
    // Foreign key column should be "customerId"
    private Customer customer;
}
```

**Answer:**
```java
@ManyToOne
@JoinColumn(name = "customerId")
private Customer customer;
```

---

## 🎯 **COMMON PATTERNS TO MEMORIZE**

### **1. Controller Pattern:**
```java
@RestController
@RequestMapping("/api/resource")
public class ResourceController {
    private final ResourceService service;
    
    public ResourceController(ResourceService service) {
        this.service = service;
    }
    
    @GetMapping
    public List<ResourceDTO> getAll() {
        return service.getAll();
    }
    
    @GetMapping("/{id}")
    public ResourceDTO getById(@PathVariable String id) {
        return service.getById(id);
    }
    
    @PostMapping
    public ResourceDTO create(@RequestBody ResourceDTO dto) {
        return service.create(dto);
    }
    
    @PutMapping("/{id}")
    public ResourceDTO update(@PathVariable String id, @RequestBody ResourceDTO dto) {
        return service.update(id, dto);
    }
    
    @DeleteMapping("/{id}")
    public void delete(@PathVariable String id) {
        service.delete(id);
    }
}
```

### **2. Service Pattern:**
```java
@Service
public class ResourceService {
    private final ResourceRepository repository;
    
    public ResourceService(ResourceRepository repository) {
        this.repository = repository;
    }
    
    public List<ResourceDTO> getAll() {
        return repository.findAll().stream()
            .map(this::toDTO)
            .toList();
    }
    
    public ResourceDTO getById(String id) {
        Optional<Resource> result = repository.findById(id);
        return result.isEmpty() ? null : toDTO(result.get());
    }
    
    public ResourceDTO create(ResourceDTO dto) {
        Resource entity = new Resource(dto.field1(), dto.field2());
        return toDTO(repository.save(entity));
    }
    
    public ResourceDTO update(String id, ResourceDTO dto) {
        Resource resource = repository.findById(id)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
        resource.setField1(dto.field1());
        resource.setField2(dto.field2());
        return toDTO(repository.save(resource));
    }
    
    public void delete(String id) {
        repository.deleteById(id);
    }
    
    private ResourceDTO toDTO(Resource resource) {
        return new ResourceDTO(resource.getId(), resource.getField1(), resource.getField2());
    }
}
```

### **3. Repository Pattern:**
```java
public interface ResourceRepository extends JpaRepository<Resource, String> {
    List<Resource> findByFieldName(String fieldName);
    List<Resource> findByFieldNameGreaterThan(BigDecimal amount);
}
```

### **4. Entity Pattern:**
```java
@Entity
@Table(name = "resources")
public class Resource {
    @Id
    @GeneratedValue
    private String id;
    
    @Column(name = "fieldName")
    private String fieldName;
    
    private BigDecimal price;
    
    public Resource() {}
    
    public Resource(String fieldName, BigDecimal price) {
        this.fieldName = fieldName;
        this.price = price;
    }
    
    // Getters and setters
}
```

---

## ✅ **CHECKLIST FOR COMPONENT CREATION**

When creating a Spring Boot component, ask yourself:

### **Controller:**
- [ ] Did I add `@RestController`?
- [ ] Did I add `@RequestMapping` with base URL?
- [ ] Did I inject Service via constructor?
- [ ] Did I use correct HTTP method annotations (`@GetMapping`, `@PostMapping`, etc.)?
- [ ] Did I use correct parameter annotations (`@PathVariable`, `@RequestParam`, `@RequestBody`)?
- [ ] Did I return the correct type (DTO, List, void)?

### **Service:**
- [ ] Did I add `@Service`?
- [ ] Did I inject Repository via constructor?
- [ ] Did I convert Entity to DTO before returning?
- [ ] Did I handle Optional correctly (orElseThrow, isEmpty check)?
- [ ] Did I create helper method for Entity → DTO conversion?

### **Repository:**
- [ ] Did I extend `JpaRepository<Entity, IDType>`?
- [ ] Did I follow naming convention for custom methods (`findBy...`)?
- [ ] Did I use correct return type (List, Optional, Entity)?

### **Entity:**
- [ ] Did I add `@Entity`?
- [ ] Did I add `@Table(name = "...")`?
- [ ] Did I add `@Id` and `@GeneratedValue`?
- [ ] Did I add `@Column` if column name differs?
- [ ] Did I add no-argument constructor?
- [ ] Did I add getters and setters (or use Lombok)?

---

## 🚨 **COMMON MISTAKES TO AVOID**

1. ❌ **Missing `@RestController`** → Controller won't work
2. ❌ **Missing `@Service`** → Service won't be a Spring bean
3. ❌ **Missing constructor injection** → Dependencies won't be injected
4. ❌ **Wrong parameter annotation** → Use `@PathVariable` for path, `@RequestParam` for query
5. ❌ **Not converting Entity to DTO** → Never return Entity from Controller
6. ❌ **Wrong JpaRepository parameters** → `JpaRepository<EntityType, IDType>`
7. ❌ **Missing `@Id` and `@GeneratedValue`** → Entity won't work
8. ❌ **Missing no-argument constructor** → JPA requires it
9. ❌ **Wrong method naming** → Repository methods must follow `findBy...` convention
10. ❌ **Not handling Optional** → Use `orElseThrow()` or `isEmpty()` check

---

## 💡 **FINAL TIPS**

1. **Start with Structure**: Write the class skeleton first (annotations, fields, constructor)
2. **Follow the Pattern**: Controller → Service → Repository → Entity
3. **Remember Annotations**: Each layer has specific annotations
4. **Entity ↔ DTO**: Always convert between Entity and DTO in Service layer
5. **Constructor Injection**: Always use constructor injection (not field injection)
6. **Test Your Logic**: Walk through your code with example data
7. **Handle Edge Cases**: Check for null, empty Optional, not found

**Remember**: 
- **Controller** = HTTP endpoints, calls Service
- **Service** = Business logic, converts Entity ↔ DTO, calls Repository
- **Repository** = Data access, extends JpaRepository
- **Entity** = Database table mapping, uses JPA annotations

**Good luck with your assessment! You've got this! 🚀**
