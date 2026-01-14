# Technical Assessment Study Guide

## 🎯 **ASSESSMENT OVERVIEW**

### **Format & Logistics:**
- **Type**: Code problems + Multiple choice questions
- **Order**: Do them in any order
- **Time**: Expect 2 hours
- **Location**: In office, proctored
- **Environment**: 
  - VSCode-style IDE
  - Closed book (secure IDE)
  - Minimal linting
  - No autofill
  - Everything built in
  - Work in single file at a time
- **Test Cases**: Already provided in environment (you don't write them)
- **Start Time**: Arrive at 9:00 AM, starts at 9:30 AM

### **What You DON'T Need:**
- ❌ Memorize dependencies
- ❌ Write test cases
- ❌ Multiple files (single file at a time)

### **What You DO Need:**
- ✅ Write Java, TypeScript, JavaScript
- ✅ Complete methods/classes/files to pass test cases
- ✅ Understand OOP concepts
- ✅ Know language basics
- ✅ Understand API architecture
- ✅ Know layered architecture
- ✅ Spring annotations for RESTful controllers
- ✅ Inheritance and class structure/extensions
- ✅ Build React components or methods

---

## 📋 **TOPICS TO MASTER**

### **1. Java Fundamentals**

#### **Class Extension (Inheritance)**

**Complete Class Extension Pattern:**
```java
// Parent class
public class Animal {
    protected String name;
    
    public Animal(String name) {
        this.name = name;
    }
    
    public void makeSound() {
        System.out.println("Some sound");
    }
}

// Complete this child class
public class Dog extends Animal {
    private String breed;
    
    // YOUR CODE HERE
    // 1. Add constructor that calls super(name)
    // 2. Override makeSound() method
    // 3. Add getBreed() method
    public Dog(String name, String breed) {
        super(name);  // Call parent constructor
        this.breed = breed;
    }
    
    @Override
    public void makeSound() {
        System.out.println("Woof!");
    }
    
    public String getBreed() {
        return breed;
    }
}
```

**Key Points:**
- **extends**: Creates inheritance relationship
- **super()**: Calls parent constructor (must be first line)
- **@Override**: Indicates method overrides parent method
- **protected**: Accessible to child classes

**Repository Extension Example:**
```java
// Complete this repository interface
public interface ExpenseRepository extends JpaRepository<Expense, String> {
    // YOUR CODE HERE
    // JpaRepository provides: save(), findById(), findAll(), deleteById()
    // Add custom methods as needed
    List<Expense> findByExpenseMerchant(String merchant);
}
```

#### **OOP Concepts (CRITICAL)**

**Encapsulation:**
```java
public class Expense {
    private BigDecimal amount;  // Private field
    
    // Public getter
    public BigDecimal getAmount() {
        return amount;
    }
    
    // Public setter
    public void setAmount(BigDecimal amount) {
        if (amount.compareTo(BigDecimal.ZERO) < 0) {
            throw new IllegalArgumentException("Amount cannot be negative");
        }
        this.amount = amount;
    }
}
```

**Inheritance:**
```java
// Parent class
public class Animal {
    protected String name;
    
    public Animal(String name) {
        this.name = name;
    }
    
    public void makeSound() {
        System.out.println("Some sound");
    }
}

// Child class
public class Dog extends Animal {
    private String breed;
    
    public Dog(String name, String breed) {
        super(name);  // Call parent constructor
        this.breed = breed;
    }
    
    @Override
    public void makeSound() {
        System.out.println("Woof!");
    }
    
    public String getBreed() {
        return breed;
    }
}
```

**Polymorphism:**
```java
Animal animal = new Dog("Buddy", "Golden Retriever");
animal.makeSound();  // Calls Dog's makeSound() - polymorphism
```

**Abstraction:**
```java
// Abstract class
public abstract class Shape {
    protected String color;
    
    public abstract double calculateArea();  // Must be implemented by child
    
    public String getColor() {
        return color;
    }
}

// Concrete implementation
public class Circle extends Shape {
    private double radius;
    
    public Circle(double radius) {
        this.radius = radius;
    }
    
    @Override
    public double calculateArea() {
        return Math.PI * radius * radius;
    }
}
```

#### **Class Structure & Extensions**

**Basic Class:**
```java
public class Expense {
    // Fields
    private String id;
    private BigDecimal amount;
    private String merchant;
    
    // Constructors
    public Expense() {}  // Default constructor
    
    public Expense(String id, BigDecimal amount, String merchant) {
        this.id = id;
        this.amount = amount;
        this.merchant = merchant;
    }
    
    // Getters and Setters
    public String getId() {
        return id;
    }
    
    public void setId(String id) {
        this.id = id;
    }
    
    // Methods
    public boolean isValid() {
        return id != null && amount != null && amount.compareTo(BigDecimal.ZERO) > 0;
    }
}
```

**Interface Implementation:**
```java
// Interface
public interface Validatable {
    boolean isValid();
    String getValidationError();
}

// Class implementing interface
public class Expense implements Validatable {
    private BigDecimal amount;
    
    @Override
    public boolean isValid() {
        return amount != null && amount.compareTo(BigDecimal.ZERO) > 0;
    }
    
    @Override
    public String getValidationError() {
        if (amount == null) return "Amount is required";
        if (amount.compareTo(BigDecimal.ZERO) <= 0) return "Amount must be positive";
        return null;
    }
}
```

#### **Common Java Patterns You'll Need:**

**Complete a Method:**
```java
// Given: Method signature and test cases
// Task: Implement the method

public class Calculator {
    // Complete this method to add two numbers
    public int add(int a, int b) {
        // YOUR CODE HERE
        return a + b;
    }
    
    // Complete this method to find maximum
    public int findMax(int[] numbers) {
        // YOUR CODE HERE
        if (numbers == null || numbers.length == 0) {
            throw new IllegalArgumentException("Array cannot be empty");
        }
        int max = numbers[0];
        for (int i = 1; i < numbers.length; i++) {
            if (numbers[i] > max) {
                max = numbers[i];
            }
        }
        return max;
    }
}
```

**Complete a Class:**
```java
// Given: Class name, some fields, test cases
// Task: Complete the class with constructors, getters, setters, methods

public class Expense {
    private String id;
    private BigDecimal amount;
    
    // Complete constructor
    public Expense(String id, BigDecimal amount) {
        // YOUR CODE HERE
        this.id = id;
        this.amount = amount;
    }
    
    // Complete getter
    public BigDecimal getAmount() {
        // YOUR CODE HERE
        return amount;
    }
    
    // Complete validation method
    public boolean isValid() {
        // YOUR CODE HERE
        return id != null && !id.isEmpty() && 
               amount != null && amount.compareTo(BigDecimal.ZERO) > 0;
    }
}
```

---

### **2. Spring Boot Initialization & Configuration**

#### **Spring Boot Application Initialization**

**Reference**: `W6/ExpenseReport/src/main/java/com/revature/ExpenseReport/ExpenseReportApplication.java`

```java
@SpringBootApplication
public class ExpenseReportApplication {
    public static void main(String[] args) {
        SpringApplication.run(ExpenseReportApplication.class, args);
    }
}
```

**What @SpringBootApplication Does:**
- Combines `@Configuration`, `@EnableAutoConfiguration`, and `@ComponentScan`
- Enables component scanning for @Component, @Service, @Repository, @Controller
- Starts Spring Boot application and embedded server

**Complete Initialization Pattern:**
```java
@SpringBootApplication
public class MyApplication {
    public static void main(String[] args) {
        // YOUR CODE HERE
        SpringApplication.run(MyApplication.class, args);
    }
}
```

#### **Basic Spring Annotations**

**Essential Annotations Table:**

| Annotation | Purpose | Example |
|------------|---------|---------|
| `@SpringBootApplication` | Main application class | `@SpringBootApplication` on main class |
| `@Component` | Generic Spring bean | `@Component` on any class |
| `@Service` | Business logic layer | `@Service` on service classes |
| `@Repository` | Data access layer | `@Repository` on repository interfaces |
| `@Controller` | Web controller (MVC) | `@Controller` for server-rendered pages |
| `@RestController` | REST API controller | `@RestController` for JSON APIs |
| `@Configuration` | Configuration class | `@Configuration` on config classes |
| `@Bean` | Creates a bean | `@Bean` on methods in @Configuration |

**Complete Bean Creation:**

**Reference**: `W6/ExpenseReport/src/main/java/com/revature/ExpenseReport/ExpenseReportApplication.java` (lines 27-30, 33-59)

```java
@SpringBootApplication
public class ExpenseReportApplication {
    
    // Complete this method to create a PasswordEncoder bean
    @Bean
    public PasswordEncoder passwordEncoder() {
        // YOUR CODE HERE
        return new BCryptPasswordEncoder();
    }
    
    // Complete this method to create a CommandLineRunner bean
    @Bean
    CommandLineRunner seedData(ExpenseRepository repository) {
        // YOUR CODE HERE
        return args -> {
            var expense = new Expense(LocalDate.now(), new BigDecimal(50.00), "Walmart");
            repository.save(expense);
        };
    }
}
```

**@Bean Pattern:**
- **Location**: In @Configuration class or main application class
- **Method name**: Becomes bean name
- **Return type**: Type of bean created
- **Parameters**: Automatically injected by Spring

#### **Configuration Classes**

**Reference**: `W6/ExpenseReport/src/main/java/com/revature/ExpenseReport/WebConfig.java`

```java
@Configuration
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

**Complete Configuration Class Pattern:**
```java
// Complete this configuration class
@Configuration
public class AppConfig {
    // YOUR CODE HERE
    // Add @Bean methods if needed
    // Implement interfaces like WebMvcConfigurer if needed
}
```

#### **application.yaml Configuration**

**Reference**: `W8/Eureka/gateway/src/main/resources/application.yaml`

```yaml
server:
  port: 8080

spring:
  application:
    name: ExpenseReport
  datasource:
    url: jdbc:postgresql://localhost:5432/expensedb
    username: admin
    password: password
  jpa:
    hibernate:
      ddl-auto: update
    show-sql: true

logging:
  level:
    root: INFO
    com.revature: DEBUG
```

**YAML vs Properties:**
- **YAML**: Hierarchical structure (indentation-based)
- **Properties**: Flat structure (`key=value`)
- **Both work**: Spring Boot supports both formats

**Complete YAML Configuration:**
```yaml
# Complete this application.yaml
server:
  # YOUR CODE HERE - set port to 8080
  port: 8080

spring:
  # YOUR CODE HERE - set application name
  application:
    name: MyApp
```

---

### **3. Entity Definitions**

#### **Basic Entity Structure**

**Reference**: 
- `W6/ExpenseReport/src/main/java/com/revature/ExpenseReport/Model/Expense.java`
- `W6/ExpenseReport/src/main/java/com/revature/ExpenseReport/Model/Report.java`

```java
@Entity  // Marks as JPA entity
@Table(name = "expenses")  // Table name
public class Expense {
    @Id  // Primary key
    @GeneratedValue  // Auto-generate ID
    private String expenseId;
    
    @Column(name = "expenseMerchant")  // Column name mapping
    private String expenseMerchant;
    
    private LocalDate expenseDate;  // Column name inferred: expense_date
    private BigDecimal expenseValue;
}
```

**Complete Entity Pattern:**
```java
// Complete this entity class
@Entity
@Table(name = "users")
public class User {
    // YOUR CODE HERE
    // Add @Id and @GeneratedValue
    // Add @Column annotations if needed
    // Add fields, constructors, getters, setters
}
```

#### **Entity Relationships**

**Many-to-One (Expense → Report):**
```java
// Expense.java (lines 18-21)
@Entity
public class Expense {
    @ManyToOne  // Many expenses belong to one report
    @JoinColumn(name = "reportId")  // Foreign key column
    @ToString.Exclude  // Lombok: prevent circular reference
    private Report report;
}
```

**One-to-Many (Report → Expenses):**
```java
// Report.java (lines 22-23)
@Entity
public class Report {
    @OneToMany(mappedBy = "report")  // "report" is field name in Expense
    private List<Expense> reportExpenses = new ArrayList<>();
}
```

**Complete Relationship Pattern:**
```java
// Complete this entity with relationship
@Entity
public class Order {
    @Id
    @GeneratedValue
    private String id;
    
    // YOUR CODE HERE - Add @ManyToOne relationship to Customer
    @ManyToOne
    @JoinColumn(name = "customerId")
    private Customer customer;
}
```

#### **Lombok Annotations**

**Reference**: `W6/ExpenseReport/src/main/java/com/revature/ExpenseReport/Model/Report.java` (lines 12-13)

```java
@Data  // Generates: getters, setters, toString(), equals(), hashCode()
@NoArgsConstructor  // Generates: public Report() {}
public class Report {
    @Id
    @GeneratedValue
    private String reportId;
    // No need to write getters/setters!
}
```

**Common Lombok Annotations:**
- **@Data**: All getters, setters, toString, equals, hashCode
- **@NoArgsConstructor**: No-argument constructor (required by JPA)
- **@AllArgsConstructor**: Constructor with all fields
- **@ToString.Exclude**: Exclude field from toString()

**Complete Entity with Lombok:**
```java
// Complete this entity using Lombok
@Entity
@Table(name = "products")
@Data  // YOUR CODE HERE - Add Lombok annotation
@NoArgsConstructor  // YOUR CODE HERE - Add Lombok annotation
public class Product {
    @Id
    @GeneratedValue
    private String id;
    private String name;
    private BigDecimal price;
}
```

#### **ID and Generation**

```java
@Id  // Marks as primary key
@GeneratedValue  // Auto-generates ID (database generates it)
private String expenseId;
```

**Complete ID Pattern:**
```java
@Entity
public class MyEntity {
    // YOUR CODE HERE - Add @Id and @GeneratedValue
    @Id
    @GeneratedValue
    private String id;
}
```

---

### **4. Service and Repository with JPA**

#### **Creating Service Class**

**Reference**: `W6/ExpenseReport/src/main/java/com/revature/ExpenseReport/Service/ExpenseService.java`

```java
@Service  // Marks as service layer
public class ExpenseService {
    private final ExpenseRepository repository;
    
    // Constructor injection
    public ExpenseService(ExpenseRepository repository) {
        this.repository = repository;
    }
    
    public List<ExpenseDTO> getAllExpenses() {
        return repository.findAll().stream()
            .map(this::ExpenseToDto)  // Convert entity to DTO
            .toList();
    }
    
    public ExpenseDTO create(ExpenseWOIDDTO dto) {
        Expense entity = new Expense(dto.expenseDate(), dto.expenseValue(), dto.expenseMerchant());
        Expense saved = repository.save(entity);  // Save to database
        return ExpenseToDto(saved);  // Convert to DTO
    }
}
```

**Complete Service Method Pattern:**
```java
@Service
public class ExpenseService {
    private final ExpenseRepository repository;
    
    public ExpenseService(ExpenseRepository repository) {
        this.repository = repository;
    }
    
    // Complete this method to get all expenses
    public List<ExpenseDTO> getAll() {
        // YOUR CODE HERE
        // 1. Call repository.findAll()
        // 2. Convert each Expense entity to ExpenseDTO
        // 3. Return List<ExpenseDTO>
        return repository.findAll().stream()
            .map(this::toDTO)
            .toList();
    }
    
    // Complete this method to create an expense
    public ExpenseDTO create(ExpenseDTO dto) {
        // YOUR CODE HERE
        // 1. Create Expense entity from DTO
        // 2. Save entity using repository.save()
        // 3. Convert saved entity to DTO
        // 4. Return DTO
        Expense entity = new Expense(dto.expenseDate(), dto.expenseValue(), dto.expenseMerchant());
        Expense saved = repository.save(entity);
        return toDTO(saved);
    }
    
    private ExpenseDTO toDTO(Expense expense) {
        return new ExpenseDTO(expense.getId(), expense.getDate(), 
                            expense.getValue(), expense.getMerchant());
    }
}
```

#### **Creating Repository Interface**

**Reference**: `W6/ExpenseReport/src/main/java/com/revature/ExpenseReport/Repository/ExpenseRepository.java`

```java
public interface ExpenseRepository extends JpaRepository<Expense, String> {
    // Spring automatically provides:
    // - save(Expense) → Saves entity
    // - findById(String) → Finds by ID
    // - findAll() → Finds all
    // - deleteById(String) → Deletes by ID
    
    // Custom query method
    List<Expense> findByExpenseMerchant(String merchant);
    // Spring generates: SELECT * FROM expenses WHERE expenseMerchant = ?
}
```

**Complete Repository Pattern:**
```java
// Complete this repository interface
public interface ExpenseRepository extends JpaRepository<Expense, String> {
    // YOUR CODE HERE - Add custom query method
    // Method name: findByExpenseMerchant
    // Spring generates: WHERE expenseMerchant = ?
    List<Expense> findByExpenseMerchant(String merchant);
    
    // YOUR CODE HERE - Add method to find by value greater than
    List<Expense> findByExpenseValueGreaterThan(BigDecimal amount);
}
```

**JpaRepository Parameters:**
- **First**: Entity type (`Expense`)
- **Second**: ID type (`String`)

---

### **5. Spring RESTful Controller Annotations**

#### **Essential Annotations:**

**Reference**: `W6/ExpenseReport/src/main/java/com/revature/ExpenseReport/Controller/ExpenseController.java`

```java
@RestController  // Marks as REST controller (returns JSON)
@RequestMapping("/api/expenses")  // Base URL
public class ExpenseController {
    
    private final ExpenseService service;
    
    // Constructor injection
    public ExpenseController(ExpenseService service) {
        this.service = service;
    }
    
    // GET - Read all
    @GetMapping
    public List<ExpenseDTO> getAll() {
        return service.getAll();
    }
    
    // GET - Read one by ID
    @GetMapping("/{id}")
    public ExpenseDTO getById(@PathVariable String id) {
        return service.getById(id);
    }
    
    // POST - Create
    @PostMapping
    public ExpenseDTO create(@RequestBody ExpenseDTO dto) {
        return service.create(dto);
    }
    
    // PUT - Update
    @PutMapping("/{id}")
    public ExpenseDTO update(@PathVariable String id, @RequestBody ExpenseDTO dto) {
        return service.update(id, dto);
    }
    
    // DELETE - Delete
    @DeleteMapping("/{id}")
    public void delete(@PathVariable String id) {
        service.delete(id);
    }
    
    // GET with query parameter
    @GetMapping("/search")
    public List<ExpenseDTO> search(@RequestParam String merchant) {
        return service.searchByMerchant(merchant);
    }
}
```

#### **Creating Endpoint Parameters**

**Path Variables:**
```java
@GetMapping("/{id}")
public ExpenseDTO getById(@PathVariable String id) {
    // URL: GET /api/expenses/123
    // id = "123"
    return service.getById(id);
}
```

**Request Parameters:**
```java
@GetMapping("/search")
public List<ExpenseDTO> search(@RequestParam String merchant) {
    // URL: GET /api/expenses/search?merchant=Walmart
    // merchant = "Walmart"
    return service.searchByMerchant(merchant);
}
```

**Request Body:**
```java
@PostMapping
public ExpenseDTO create(@RequestBody ExpenseDTO dto) {
    // POST /api/expenses
    // Body: {"expenseDate": "2024-01-15", "expenseValue": 50.00}
    // Spring converts JSON to ExpenseDTO
    return service.create(dto);
}
```

#### **ResponseEntity Usage**

**Reference**: `W6/ExpenseReport/src/main/java/com/revature/ExpenseReport/Controller/ReportController.java`

```java
@PostMapping
@ResponseStatus(HttpStatus.CREATED)  // Sets status to 201
public ReportDTO create(@RequestBody ReportDTO report) {
    return service.create(report);
}

// Alternative with ResponseEntity:
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

**Complete Controller Method with ResponseEntity:**
```java
@RestController
@RequestMapping("/api/users")
public class UserController {
    private final UserService service;
    
    public UserController(UserService service) {
        this.service = service;
    }
    
    // Complete this method to create a user with 201 status
    @PostMapping
    public ResponseEntity<UserDTO> create(@RequestBody UserDTO dto) {
        // YOUR CODE HERE
        UserDTO created = service.create(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }
    
    // Complete this method to get user by ID with 404 handling
    @GetMapping("/{id}")
    public ResponseEntity<UserDTO> getById(@PathVariable String id) {
        // YOUR CODE HERE
        UserDTO user = service.getById(id);
        if (user == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(user);
    }
}
```

**ResponseEntity Methods:**
- `ResponseEntity.ok(body)` - 200 OK
- `ResponseEntity.status(HttpStatus.CREATED).body(body)` - 201 Created
- `ResponseEntity.noContent().build()` - 204 No Content
- `ResponseEntity.notFound().build()` - 404 Not Found

#### **Common Patterns You'll Complete:**

**Complete a Controller Method:**
```java
@RestController
@RequestMapping("/api/users")
public class UserController {
    private final UserService service;
    
    public UserController(UserService service) {
        this.service = service;
    }
    
    // Complete this method to get user by ID
    @GetMapping("/{id}")
    public UserDTO getById(@PathVariable String id) {
        // YOUR CODE HERE
        return service.getById(id);
    }
    
    // Complete this method to create a user
    @PostMapping
    public UserDTO create(@RequestBody UserDTO dto) {
        // YOUR CODE HERE
        return service.create(dto);
    }
}
```

**Key Points:**
- `@PathVariable` extracts from URL: `/api/users/{id}` → `id` parameter
- `@RequestParam` extracts from query: `/api/users/search?name=John` → `name` parameter
- `@RequestBody` converts JSON to Java object
- Return types are automatically converted to JSON

---

### **3. Layered Architecture**

#### **Understanding the Layers:**

```
┌─────────────────────────────────────┐
│         Controller Layer            │  ← Handles HTTP requests
│    (@RestController, @GetMapping)   │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│          Service Layer               │  ← Business logic
│         (@Service)                   │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│        Repository Layer              │  ← Data access
│    (extends JpaRepository)           │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│           Database                   │
└─────────────────────────────────────┘
```

#### **Complete a Service Method:**
```java
@Service
public class ExpenseService {
    private final ExpenseRepository repository;
    
    public ExpenseService(ExpenseRepository repository) {
        this.repository = repository;
    }
    
    // Complete this method to get all expenses
    public List<ExpenseDTO> getAll() {
        // YOUR CODE HERE
        return repository.findAll().stream()
            .map(this::toDTO)
            .toList();
    }
    
    // Complete this method to create an expense
    public ExpenseDTO create(ExpenseDTO dto) {
        // YOUR CODE HERE
        Expense entity = new Expense(dto.expenseDate(), dto.expenseValue(), dto.expenseMerchant());
        Expense saved = repository.save(entity);
        return toDTO(saved);
    }
    
    // Helper method
    private ExpenseDTO toDTO(Expense expense) {
        return new ExpenseDTO(expense.getId(), expense.getDate(), 
                            expense.getValue(), expense.getMerchant());
    }
}
```

#### **Complete a Repository Method:**
```java
public interface ExpenseRepository extends JpaRepository<Expense, String> {
    // Complete this method to find by merchant
    // Spring generates SQL: WHERE expenseMerchant = ?
    List<Expense> findByExpenseMerchant(String merchant);
    
    // Complete this method to find expenses greater than amount
    List<Expense> findByExpenseValueGreaterThan(BigDecimal amount);
}
```

---

### **6. React Initialization & Setup**

#### **React Application Initialization**

**Reference**: `W5/React/expense-tracker/src/main.jsx`

```jsx
import './index.css';
import App from './App.jsx';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
)
```

**Complete Initialization Pattern:**
```jsx
// Complete this main.jsx file
import React from 'react';
import ReactDOM from 'react-dom/client';
// YOUR CODE HERE - Import BrowserRouter
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* YOUR CODE HERE - Wrap App with BrowserRouter */}
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
)
```

**Key Points:**
- **ReactDOM.createRoot()**: Creates root for React 18+
- **BrowserRouter**: Enables routing (must wrap App)
- **React.StrictMode**: Development mode checks

---

### **7. React Components & Methods**

#### **Component Creation**

**Reference**: `W5/React/expense-tracker/src/components/ExpenseForm.jsx`

```jsx
import { useState } from "react";

function ExpenseForm({ onSaveExpenseData }) {
    const [enteredTitle, setEnteredTitle] = useState('');
    const [enteredAmount, setEnteredAmount] = useState('');
    const [enteredDate, setEnteredDate] = useState('');
    
    const titleChangeHandler = (event) => {
        setEnteredTitle(event.target.value);
    };
    
    const submitHandler = (event) => {
        event.preventDefault();
        const expenseData = {
            title: enteredTitle,
            amount: enteredAmount,
            date: new Date(`${enteredDate}T00:00:00`)
        };
        onSaveExpenseData(expenseData);
    };
    
    return (
        <form onSubmit={submitHandler}>
            <input
                value={enteredTitle}
                onChange={titleChangeHandler}
                placeholder="Title"
            />
            <button type="submit">Add Expense</button>
        </form>
    );
}

export default ExpenseForm;
```

**Component Pattern:**
1. Import hooks: `import { useState, useEffect } from 'react'`
2. Function declaration: `function ComponentName(props)`
3. State: `useState` hooks
4. Event handlers: Functions for interactions
5. Return JSX: What to render
6. Export: `export default ComponentName`

#### **React Service Layer**

**Reference**: `W5/React/expense-tracker/src/services/ExpensesService.jsx`

```jsx
const ExpensesService = {
    baseUrl: "http://localhost:3000/expenses",

    async getAll() {
        const response = await fetch(this.baseUrl);
        if (!response.ok) throw new Error('Failed to fetch!');
        return response.json();
    },
    
    async postExpense(expense) {
        const response = await fetch(this.baseUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(expense)
        });
        if(!response.ok) throw new Error('Failed to save expense!');
        return response.json();
    },
    
    async deleteExpense(id) {
        const response = await fetch(`${this.baseUrl}/${id}`, {
            method: 'DELETE'
        });
        if(!response.ok) throw new Error('Failed to delete expense!');
        return response.json();
    }
};

export default ExpensesService;
```

**Complete Service Pattern:**
```jsx
// Complete this service object
const ExpensesService = {
    baseUrl: "http://localhost:3000/expenses",

    // Complete this method to get all expenses
    async getAll() {
        // YOUR CODE HERE
        // 1. Fetch from this.baseUrl
        // 2. Check response.ok
        // 3. Return response.json()
        const response = await fetch(this.baseUrl);
        if (!response.ok) throw new Error('Failed to fetch!');
        return response.json();
    },
    
    // Complete this method to create an expense
    async postExpense(expense) {
        // YOUR CODE HERE
        // 1. Fetch with POST method
        // 2. Set headers: 'Content-Type': 'application/json'
        // 3. Set body: JSON.stringify(expense)
        // 4. Check response.ok
        // 5. Return response.json()
        const response = await fetch(this.baseUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(expense)
        });
        if(!response.ok) throw new Error('Failed to save expense!');
        return response.json();
    }
};

export default ExpensesService;
```

#### **TypeScript Interfaces**

**Reference**: `W5/Ben-Demos/pokemon-hunter/src/app/interfaces/pokemon.ts`

```typescript
export interface Pokemon {
    id: number;
    name: string;
    sprite: string;
    types?: object[];  // ? means optional
}

// Usage in component:
function PokemonCard({ pokemon }: { pokemon: Pokemon }) {
    return (
        <div>
            <h3>{pokemon.name}</h3>
            <img src={pokemon.sprite} alt={pokemon.name} />
        </div>
    );
}
```

**Complete Interface Pattern:**
```typescript
// Complete this interface
interface Expense {
    // YOUR CODE HERE
    // Add id: string
    // Add amount: number
    // Add merchant: string
    // Add date: Date (optional)
    id: string;
    amount: number;
    merchant: string;
    date?: Date;  // ? means optional
}
```

#### **Component Interaction**

**Parent to Child (Props):**
```jsx
// App.jsx (Parent)
function App() {
    const [expenses, setExpenses] = useState([]);
    return <ExpenseList expenses={expenses} />;  // Pass data down
}

// ExpenseList.jsx (Child)
function ExpenseList({ expenses }) {  // Receive props
    return expenses.map(expense => <ExpenseItem key={expense.id} expense={expense} />);
}
```

**Child to Parent (Callbacks):**
```jsx
// App.jsx (Parent)
function App() {
    const addExpenseHandler = (expense) => {
        setExpenses([...expenses, expense]);
    };
    return <ExpenseForm onSaveExpenseData={addExpenseHandler} />;  // Pass callback
}

// ExpenseForm.jsx (Child)
function ExpenseForm({ onSaveExpenseData }) {  // Receive callback
    const handleSubmit = (e) => {
        e.preventDefault();
        onSaveExpenseData(expenseData);  // Call parent function
    };
    return <form onSubmit={handleSubmit}>...</form>;
}
```

#### **React Routing**

**Reference**: 
- `W5/React/expense-tracker/src/App.jsx` (Routes, Route, useNavigate)
- `W5/React/expense-tracker/src/components/pages/Navigation.jsx` (Link)

```jsx
// App.jsx
import { Routes, Route, Link, useNavigate } from 'react-router-dom';

function App() {
    const navigate = useNavigate();
    
    return (
        <Routes>
            <Route path="/dashboard" element={<ExpensesDashboard />} />
            <Route path="/reports" element={<SavedReportsPage />} />
            <Route path="/" element={<div><Link to="/dashboard">Dashboard</Link></div>} />
        </Routes>
    );
}
```

**Complete Routing Pattern:**
```jsx
// Complete this routing setup
import { Routes, Route, Link, useNavigate } from 'react-router-dom';

function App() {
    const navigate = useNavigate();
    
    return (
        <Routes>
            {/* YOUR CODE HERE - Add route for /expenses */}
            <Route path="/expenses" element={<ExpenseList />} />
            
            {/* YOUR CODE HERE - Add route for /expenses/:id */}
            <Route path="/expenses/:id" element={<ExpenseDetail />} />
        </Routes>
    );
}

// Complete navigation component
function Navigation() {
    return (
        <nav>
            {/* YOUR CODE HERE - Add Link to /expenses */}
            <Link to="/expenses">Expenses</Link>
        </nav>
    );
}
```

**Key Concepts:**
- **BrowserRouter**: Enables routing (wrap in main.jsx)
- **Routes**: Container for route definitions
- **Route**: Defines path and component to render
- **Link**: Navigation link (no page refresh)
- **useNavigate**: Hook for programmatic navigation

#### **Auth Guard (Conceptual)**

**Example Pattern:**
```jsx
// ProtectedRoute.jsx (Auth Guard Component)
function ProtectedRoute({ children }) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const navigate = useNavigate();
    
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');  // Redirect to login
        } else {
            setIsAuthenticated(true);
        }
    }, [navigate]);
    
    if (!isAuthenticated) {
        return null;  // Or loading spinner
    }
    
    return children;  // Render protected content
}

// Usage:
<Routes>
    <Route path="/login" element={<Login />} />
    <Route path="/dashboard" element={
        <ProtectedRoute>
            <ExpensesDashboard />
        </ProtectedRoute>
    } />
</Routes>
```

**Complete Auth Guard Pattern:**
```jsx
// Complete this auth guard component
function ProtectedRoute({ children }) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const navigate = useNavigate();
    
    useEffect(() => {
        // YOUR CODE HERE
        // 1. Check for token in localStorage
        // 2. If no token, navigate to '/login'
        // 3. If token exists, set isAuthenticated to true
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
        } else {
            setIsAuthenticated(true);
        }
    }, [navigate]);
    
    if (!isAuthenticated) {
        return null;
    }
    
    return children;
}
```

---

### **8. React Components & Methods**

#### **Complete a React Component:**
```jsx
// Complete this component to display a list of expenses
function ExpenseList({ expenses, onDelete }) {
    // YOUR CODE HERE
    return (
        <div>
            {expenses.map(expense => (
                <div key={expense.id}>
                    <h3>{expense.title}</h3>
                    <p>${expense.amount}</p>
                    <button onClick={() => onDelete(expense.id)}>Delete</button>
                </div>
            ))}
        </div>
    );
}
```

#### **Complete a Method in a Component:**
```jsx
function ExpenseForm({ onSubmit }) {
    const [title, setTitle] = useState('');
    const [amount, setAmount] = useState('');
    
    // Complete this method to handle form submission
    const handleSubmit = (e) => {
        // YOUR CODE HERE
        e.preventDefault();
        onSubmit({ title, amount: parseFloat(amount) });
        setTitle('');
        setAmount('');
    };
    
    return (
        <form onSubmit={handleSubmit}>
            <input 
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Title"
            />
            <input 
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Amount"
            />
            <button type="submit">Add Expense</button>
        </form>
    );
}
```

#### **Complete useState/useEffect:**
```jsx
function ExpenseDashboard() {
    const [expenses, setExpenses] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // Complete this useEffect to fetch expenses on mount
    useEffect(() => {
        // YOUR CODE HERE
        async function fetchExpenses() {
            try {
                const response = await fetch('/api/expenses');
                const data = await response.json();
                setExpenses(data);
            } catch (error) {
                console.error('Error:', error);
            } finally {
                setLoading(false);
            }
        }
        fetchExpenses();
    }, []);  // Empty array = run once on mount
    
    if (loading) return <div>Loading...</div>;
    
    return (
        <div>
            {expenses.map(expense => (
                <ExpenseItem key={expense.id} expense={expense} />
            ))}
        </div>
    );
}
```

#### **Complete Event Handlers:**
```jsx
function ExpenseItem({ expense, onDelete, onUpdate }) {
    // Complete this method to handle delete
    const handleDelete = () => {
        // YOUR CODE HERE
        onDelete(expense.id);
    };
    
    // Complete this method to handle update
    const handleUpdate = (newAmount) => {
        // YOUR CODE HERE
        onUpdate(expense.id, newAmount);
    };
    
    return (
        <div>
            <h3>{expense.title}</h3>
            <p>${expense.amount}</p>
            <button onClick={handleDelete}>Delete</button>
            <button onClick={() => handleUpdate(expense.amount * 1.1)}>Increase 10%</button>
        </div>
    );
}
```

---

### **5. TypeScript/JavaScript Basics**

#### **Complete TypeScript Functions:**
```typescript
// Complete this function to calculate total
function calculateTotal(expenses: Expense[]): number {
    // YOUR CODE HERE
    return expenses.reduce((sum, expense) => sum + expense.amount, 0);
}

// Complete this function to filter expenses
function filterExpenses(expenses: Expense[], minAmount: number): Expense[] {
    // YOUR CODE HERE
    return expenses.filter(expense => expense.amount >= minAmount);
}

// Complete this interface
interface Expense {
    id: string;
    amount: number;
    merchant: string;
    // YOUR CODE HERE - add date field
    date: Date;
}
```

#### **Complete JavaScript Array Methods:**
```javascript
// Complete this function using map
function getExpenseTitles(expenses) {
    // YOUR CODE HERE
    return expenses.map(expense => expense.title);
}

// Complete this function using filter
function getExpensiveExpenses(expenses, threshold) {
    // YOUR CODE HERE
    return expenses.filter(expense => expense.amount > threshold);
}

// Complete this function using reduce
function getTotalAmount(expenses) {
    // YOUR CODE HERE
    return expenses.reduce((total, expense) => total + expense.amount, 0);
}
```

---

## 🧠 **PROBLEM-SOLVING APPROACH**

### **STEP-BY-STEP PROCESS:**

#### **1. READ THE PROBLEM CAREFULLY**
- What is the method/class supposed to do?
- What are the inputs?
- What should be returned?
- Are there any constraints?

#### **2. PSEUDOCODE (CRITICAL!)**
Write out your process in plain English:

```java
// Example: Complete method to find maximum value in array
public int findMax(int[] numbers) {
    // PSEUDOCODE:
    // 1. Check if array is null or empty - throw exception
    // 2. Initialize max with first element
    // 3. Loop through remaining elements
    // 4. If current element > max, update max
    // 5. Return max
    
    // NOW WRITE THE CODE:
    if (numbers == null || numbers.length == 0) {
        throw new IllegalArgumentException("Array cannot be empty");
    }
    
    int max = numbers[0];
    for (int i = 1; i < numbers.length; i++) {
        if (numbers[i] > max) {
            max = numbers[i];
        }
    }
    return max;
}
```

#### **3. IDENTIFY PATTERNS**
- Is this a CRUD operation? (Create, Read, Update, Delete)
- Is this a transformation? (map, filter, reduce)
- Is this a validation? (check conditions)
- Is this a calculation? (math operations)

#### **4. WRITE THE CODE**
- Start with the structure
- Fill in the logic
- Handle edge cases (null, empty, invalid input)

#### **5. TEST YOUR LOGIC**
- Walk through with example inputs
- Check edge cases
- Verify return types match

---

## 📝 **PRACTICE SCENARIOS**

### **Scenario 1: Complete a Java Method**

**Given:**
```java
public class Calculator {
    // Complete this method to add two numbers
    public int add(int a, int b) {
        // YOUR CODE HERE
    }
}
```

**Your Process:**
1. **Read**: Add two numbers
2. **Pseudocode**: Return a + b
3. **Code**: `return a + b;`

**Answer:**
```java
public int add(int a, int b) {
    return a + b;
}
```

---

### **Scenario 2: Complete a Service Method**

**Given:**
```java
@Service
public class ExpenseService {
    private final ExpenseRepository repository;
    
    public ExpenseService(ExpenseRepository repository) {
        this.repository = repository;
    }
    
    // Complete this method to get expense by ID
    public ExpenseDTO getById(String id) {
        // YOUR CODE HERE
    }
}
```

**Your Process:**
1. **Read**: Get expense by ID from repository, convert to DTO
2. **Pseudocode**: 
   - Call repository.findById(id)
   - Convert Expense entity to ExpenseDTO
   - Return DTO
3. **Code**:
```java
public ExpenseDTO getById(String id) {
    Expense expense = repository.findById(id)
        .orElseThrow(() -> new RuntimeException("Expense not found"));
    return new ExpenseDTO(expense.getId(), expense.getDate(), 
                         expense.getValue(), expense.getMerchant());
}
```

---

### **Scenario 3: Complete a React Component Method**

**Given:**
```jsx
function ExpenseForm({ onSubmit }) {
    const [title, setTitle] = useState('');
    const [amount, setAmount] = useState('');
    
    // Complete this method
    const handleSubmit = (e) => {
        // YOUR CODE HERE
    };
    
    return (
        <form onSubmit={handleSubmit}>
            <input value={title} onChange={(e) => setTitle(e.target.value)} />
            <input value={amount} onChange={(e) => setAmount(e.target.value)} />
            <button type="submit">Submit</button>
        </form>
    );
}
```

**Your Process:**
1. **Read**: Handle form submission, call onSubmit with form data
2. **Pseudocode**:
   - Prevent default form submission
   - Call onSubmit with title and amount
   - Clear form fields
3. **Code**:
```jsx
const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ title, amount: parseFloat(amount) });
    setTitle('');
    setAmount('');
};
```

---

### **Scenario 4: Complete a Controller Method**

**Given:**
```java
@RestController
@RequestMapping("/api/expenses")
public class ExpenseController {
    private final ExpenseService service;
    
    public ExpenseController(ExpenseService service) {
        this.service = service;
    }
    
    // Complete this method to get all expenses
    @GetMapping
    public List<ExpenseDTO> getAll() {
        // YOUR CODE HERE
    }
}
```

**Your Process:**
1. **Read**: GET endpoint that returns all expenses
2. **Pseudocode**: Call service.getAll() and return result
3. **Code**:
```java
@GetMapping
public List<ExpenseDTO> getAll() {
    return service.getAll();
}
```

---

## 🎯 **COMMON PATTERNS TO MEMORIZE**

### **Java Patterns:**

**1. Find Maximum in Array:**
```java
public int findMax(int[] arr) {
    if (arr == null || arr.length == 0) {
        throw new IllegalArgumentException("Array cannot be empty");
    }
    int max = arr[0];
    for (int i = 1; i < arr.length; i++) {
        if (arr[i] > max) {
            max = arr[i];
        }
    }
    return max;
}
```

**2. Check if Valid:**
```java
public boolean isValid() {
    return field1 != null && !field1.isEmpty() && 
           field2 != null && field2 > 0;
}
```

**3. Convert Entity to DTO:**
```java
private ExpenseDTO toDTO(Expense expense) {
    return new ExpenseDTO(
        expense.getId(),
        expense.getDate(),
        expense.getValue(),
        expense.getMerchant()
    );
}
```

**4. Service Method Pattern:**
```java
public ExpenseDTO getById(String id) {
    Expense expense = repository.findById(id)
        .orElseThrow(() -> new RuntimeException("Not found"));
    return toDTO(expense);
}
```

**5. Controller Method Pattern:**
```java
@GetMapping("/{id}")
public ExpenseDTO getById(@PathVariable String id) {
    return service.getById(id);
}
```

### **React Patterns:**

**1. useState Pattern:**
```jsx
const [state, setState] = useState(initialValue);
```

**2. useEffect Pattern:**
```jsx
useEffect(() => {
    // Side effect code
}, [dependencies]);  // Empty array = run once
```

**3. Event Handler Pattern:**
```jsx
const handleClick = () => {
    // Handler logic
};
```

**4. Form Submission Pattern:**
```jsx
const handleSubmit = (e) => {
    e.preventDefault();
    // Submit logic
};
```

**5. Map to Render List:**
```jsx
{items.map(item => (
    <ItemComponent key={item.id} item={item} />
))}
```

---

## ✅ **CHECKLIST BEFORE ASSESSMENT**

### **Java:**
- [ ] Can write a complete class with fields, constructor, getters, setters
- [ ] Understand class extension (extends, super, @Override)
- [ ] Can implement interfaces
- [ ] Know OOP principles (encapsulation, inheritance, polymorphism, abstraction)
- [ ] Can write methods that manipulate data
- [ ] Can handle null checks and edge cases
- [ ] Know how to use collections (List, Map, Set)

### **Spring Boot:**
- [ ] Know Spring Boot initialization (@SpringBootApplication, main method)
- [ ] Understand basic Spring annotations (@Component, @Service, @Repository, @RestController)
- [ ] Can create beans (@Bean annotation)
- [ ] Can create configuration classes (@Configuration)
- [ ] Understand application.yaml format
- [ ] Know @RestController, @RequestMapping
- [ ] Know @GetMapping, @PostMapping, @PutMapping, @DeleteMapping
- [ ] Understand @PathVariable and @RequestParam
- [ ] Understand @RequestBody
- [ ] Understand ResponseEntity and @ResponseStatus
- [ ] Can write a complete controller method
- [ ] Understand layered architecture (Controller → Service → Repository)

### **Entity & JPA:**
- [ ] Can create entity classes (@Entity, @Table)
- [ ] Understand @Id and @GeneratedValue
- [ ] Know @Column annotation
- [ ] Understand entity relationships (@ManyToOne, @OneToMany, @JoinColumn)
- [ ] Know Lombok annotations (@Data, @NoArgsConstructor)
- [ ] Can create Service class (@Service, constructor injection)
- [ ] Can create Repository interface (extends JpaRepository)
- [ ] Understand custom query methods (findBy...)

### **React:**
- [ ] Can write a functional component
- [ ] Know useState hook
- [ ] Know useEffect hook
- [ ] Can write event handlers
- [ ] Can map over arrays to render lists
- [ ] Understand props
- [ ] Can handle form submission

### **TypeScript/JavaScript:**
- [ ] Can write functions
- [ ] Know array methods (map, filter, reduce)
- [ ] Understand async/await
- [ ] Can write interfaces/types in TypeScript

### **Problem Solving:**
- [ ] Can pseudocode a solution
- [ ] Can break down problems into steps
- [ ] Can identify patterns
- [ ] Can handle edge cases

---

## 🚨 **CRITICAL REMINDERS**

### **During the Assessment:**

1. **PSEUDOCODE FIRST** - Write out your process in comments
2. **READ CAREFULLY** - Understand what the method/class should do
3. **TEST CASES ARE PROVIDED** - You don't write them, just make your code pass them
4. **SINGLE FILE** - Work in one file at a time
5. **NO AUTOFILL** - Type everything manually
6. **MINIMAL LINTING** - Don't rely on IDE suggestions
7. **TIME MANAGEMENT** - 2 hours total, manage your time

### **Common Mistakes to Avoid:**

- ❌ Forgetting to handle null/empty cases
- ❌ Not returning the correct type
- ❌ Missing `@Override` when overriding methods
- ❌ Forgetting `e.preventDefault()` in form handlers
- ❌ Not using `key` prop in React lists
- ❌ Forgetting to call service methods in controllers
- ❌ Not converting entities to DTOs in services

### **What to Do:**

- ✅ Pseudocode your solution first
- ✅ Handle edge cases (null, empty, invalid)
- ✅ Match return types exactly
- ✅ Use proper annotations
- ✅ Follow naming conventions
- ✅ Write clean, readable code

---

## 📅 **LOGISTICS FOR THURSDAY**

### **Before the Assessment:**
- [ ] Check email for interview room location
- [ ] Arrive at 9:00 AM (assessment starts at 9:30 AM)
- [ ] Dress: Business professional
- [ ] Bring: ID (if required)
- [ ] Get good sleep the night before

### **Important Notes:**
- **Performance in assessment does NOT affect face-to-face interview**
- Assessment is separate from the technical interview
- Focus on doing your best, but don't stress if you struggle

---

## 💡 **FINAL TIPS**

1. **OVERPREPARE** - Your trainer said this for a reason. Practice more than you think you need.

2. **PSEUDOCODE EVERYTHING** - Even if you think you know the answer, write out your process first.

3. **PRACTICE ISOLATED PROBLEMS** - Most questions will be "complete this method" or "complete this class"

4. **KNOW THE PATTERNS** - Memorize common patterns (controller methods, service methods, React hooks)

5. **STAY CALM** - You have 2 hours. Take your time, read carefully, pseudocode, then code.

6. **TEST YOUR LOGIC** - Walk through your code with example inputs before submitting

7. **DON'T PANIC** - If you get stuck, move on and come back. You can do problems in any order.

---

## 🎓 **PRACTICE EXERCISES**

### **Exercise 1: Complete Java Method**
```java
// Complete this method to check if a number is even
public boolean isEven(int number) {
    // YOUR CODE HERE
}
```

### **Exercise 2: Complete Service Method**
```java
// Complete this method to get all expenses
public List<ExpenseDTO> getAll() {
    // YOUR CODE HERE
    // Hint: repository.findAll() returns List<Expense>
    // Need to convert to List<ExpenseDTO>
}
```

### **Exercise 3: Complete Controller Method**
```java
// Complete this method to get expense by ID
@GetMapping("/{id}")
public ExpenseDTO getById(@PathVariable String id) {
    // YOUR CODE HERE
}
```

### **Exercise 4: Complete React Component**
```jsx
// Complete this component to display expense
function ExpenseItem({ expense, onDelete }) {
    // YOUR CODE HERE
    // Should display expense title and amount
    // Should have a delete button that calls onDelete(expense.id)
}
```

### **Exercise 5: Complete React Hook**
```jsx
// Complete this useEffect to fetch data
useEffect(() => {
    // YOUR CODE HERE
    // Fetch from '/api/expenses'
    // Set data using setExpenses
    // Handle loading state
}, []);
```

---

**Remember: Pseudocode first, then code. You've got this!**
