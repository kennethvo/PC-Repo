# Phase 1: Understanding RESTful APIs & CRUD - Detailed Guide

## 🎯 **Overview**

This guide will walk you through Phase 1 of your study plan: **Understanding RESTful APIs & CRUD operations**. We'll cover:

1. **Spring MVC & RESTful Services** - Core concepts from the documentation
2. **ExpenseController.java** - How REST controllers work
3. **ExpenseService.java** - Business logic layer
4. **ExpenseRepository.java** - Data access layer

---

## 📖 **PART 1: Understanding Spring MVC & RESTful Services**

### **1.1 What is Spring MVC?**

**Spring MVC** is a web framework that follows the **Model-View-Controller (MVC)** pattern. Think of it as a traffic controller for web requests.

**Key Components:**
- **Model**: Your data (like `Expense` objects)
- **View**: How data is presented (JSON for REST APIs, HTML for web pages)
- **Controller**: Handles HTTP requests and coordinates between Model and View

### **1.2 The Request Flow - Step by Step**

When a client (like your React app) makes an HTTP request, here's what happens:

```
1. Client sends: GET http://localhost:8080/api/expenses
   ↓
2. DispatcherServlet receives the request (Spring's front controller)
   ↓
3. HandlerMapping finds: "This request goes to ExpenseController.getAllExpenses()"
   ↓
4. HandlerAdapter invokes: ExpenseController.getAllExpenses()
   ↓
5. Controller calls: ExpenseService.getAllExpenses()
   ↓
6. Service calls: ExpenseRepository.findAll()
   ↓
7. Repository queries database and returns List<Expense>
   ↓
8. Service converts entities to DTOs: List<ExpenseDTO>
   ↓
9. Controller returns: List<ExpenseDTO>
   ↓
10. HttpMessageConverter converts to JSON
   ↓
11. Response sent back: JSON array of expenses
```

**Why This Matters for You:**
- Understanding this flow helps you debug issues
- You'll know where to look when something breaks
- Interviewers may ask about this flow

### **1.3 @Controller vs @RestController**

| Annotation | Purpose | Returns | Use Case |
|------------|---------|---------|----------|
| `@Controller` | Traditional web pages | View name (String) | Server-rendered HTML pages |
| `@RestController` | REST APIs | JSON/XML directly | API endpoints (what you're building) |

**Key Difference:**
- `@RestController` = `@Controller` + `@ResponseBody`
- `@ResponseBody` means "convert the return value to JSON automatically"

**In Your Code:**
```java
@RestController  // ← This means "return JSON, not HTML"
@RequestMapping("/api/expenses")
public class ExpenseController {
    // All methods automatically return JSON
}
```

### **1.4 HTTP Methods & CRUD Operations**

**CRUD** stands for **Create, Read, Update, Delete**. Each operation uses a specific HTTP method:

| HTTP Method | CRUD Operation | Spring Annotation | What It Does |
|-------------|----------------|-------------------|---------------|
| **GET** | **Read** | `@GetMapping` | Retrieve data (one or many) |
| **POST** | **Create** | `@PostMapping` | Create new resource |
| **PUT** | **Update** | `@PutMapping` | Update entire resource |
| **PATCH** | **Update** | `@PatchMapping` | Partial update |
| **DELETE** | **Delete** | `@DeleteMapping` | Remove resource |

**Why This Matters:**
- RESTful APIs follow these conventions
- Interview questions will test your knowledge of which method does what
- Real-world APIs use these consistently

### **1.5 @RequestMapping - Base URL Mapping**

`@RequestMapping` sets the base URL for all methods in a controller.

**Example:**
```java
@RestController
@RequestMapping("/api/expenses")  // ← Base URL
public class ExpenseController {
    
    @GetMapping  // ← This becomes: GET /api/expenses
    public List<ExpenseDTO> getAllExpenses() { ... }
    
    @GetMapping("/{id}")  // ← This becomes: GET /api/expenses/{id}
    public ExpenseDTO getById(@PathVariable String id) { ... }
}
```

**URL Construction:**
- Base: `/api/expenses`
- Method path: `/{id}`
- **Final URL**: `/api/expenses/{id}`

### **1.6 Path Variables vs Request Parameters**

**@PathVariable** - Extracts from URL path:
```java
// URL: GET /api/expenses/abc123
@GetMapping("/{id}")
public ExpenseDTO getById(@PathVariable String id) {
    // id = "abc123" (from the URL path)
}
```

**@RequestParam** - Extracts from query string:
```java
// URL: GET /api/expenses/search?merchant=Walmart
@GetMapping("/search")
public List<ExpenseDTO> search(@RequestParam String merchant) {
    // merchant = "Walmart" (from ?merchant=Walmart)
}
```

**When to Use:**
- **@PathVariable**: For resource identifiers (like expense ID)
- **@RequestParam**: For filtering, searching, pagination

### **1.7 @RequestBody - Receiving JSON Data**

`@RequestBody` tells Spring: "Convert the JSON in the request body to a Java object."

**Example:**
```java
@PostMapping
public ExpenseDTO create(@RequestBody ExpenseWOIDDTO dto) {
    // Spring automatically converts JSON to ExpenseWOIDDTO
    // {
    //   "expenseDate": "2024-01-15",
    //   "expenseValue": 50.00,
    //   "expenseMerchant": "Walmart"
    // }
    // ↓ becomes ExpenseWOIDDTO object
}
```

**How It Works:**
1. Client sends JSON in request body
2. Spring's `HttpMessageConverter` reads the JSON
3. Converts JSON to Java object using Jackson library
4. Passes object to your method

### **1.8 HTTP Status Codes**

Spring Boot automatically sets status codes, but you can control them:

| Status Code | Meaning | When Used |
|-------------|---------|-----------|
| **200 OK** | Success | GET, PUT (default) |
| **201 Created** | Resource created | POST (should return this) |
| **204 No Content** | Success, no body | DELETE (should return this) |
| **400 Bad Request** | Invalid request | Validation errors |
| **404 Not Found** | Resource doesn't exist | Invalid ID |
| **500 Internal Server Error** | Server error | Exceptions |

**In Your Code:**
```java
@PostMapping
public ExpenseDTO create(@RequestBody ExpenseWOIDDTO dto) {
    // By default, returns 200 OK
    // Should return 201 Created (we'll see how later)
}
```

---

## 🔍 **PART 2: ExpenseController.java - Deep Dive**

Let's break down `ExpenseController.java` line by line:

### **2.1 Class-Level Annotations**

```java
@RestController
@RequestMapping("/api/expenses")
public class ExpenseController {
```

**@RestController:**
- **What it does**: Marks this class as a REST controller
- **Effect**: All methods return JSON (not HTML views)
- **Equivalent to**: `@Controller` + `@ResponseBody` on every method

**@RequestMapping("/api/expenses"):**
- **What it does**: Sets base URL for all methods
- **Effect**: All URLs start with `/api/expenses`
- **Example**: Method with `@GetMapping("/{id}")` becomes `/api/expenses/{id}`

### **2.2 Dependency Injection - Constructor**

```java
private final ExpenseService service;

public ExpenseController(ExpenseService service) {
    this.service = service;
}
```

**What's Happening:**
1. **Dependency Injection**: Spring automatically creates `ExpenseService` and passes it to the constructor
2. **Why `final`**: Makes the field immutable (can't be changed after construction)
3. **Why constructor**: Best practice - ensures service is always provided

**How Spring Does This:**
- Spring scans for `@Service` on `ExpenseService`
- Creates one instance (singleton)
- When creating `ExpenseController`, Spring sees it needs `ExpenseService`
- Automatically injects it via constructor

### **2.3 Method 1: GET All Expenses (READ)**

```java
@GetMapping  // domain:port/api/expenses
public List<ExpenseDTO> getAllExpenses() {
    return service.getAllExpenses(); // all of the expenses!
}
```

**Breaking It Down:**

**@GetMapping:**
- **HTTP Method**: GET
- **URL**: `/api/expenses` (base URL + empty path)
- **Purpose**: Retrieve all expenses

**Return Type: `List<ExpenseDTO>`:**
- Returns a list of Data Transfer Objects
- Spring automatically converts to JSON array

**Method Body:**
- Calls `service.getAllExpenses()`
- Controller doesn't contain business logic - it delegates to Service

**Request Flow:**
```
1. Client: GET /api/expenses
2. Spring routes to: ExpenseController.getAllExpenses()
3. Controller calls: ExpenseService.getAllExpenses()
4. Service calls: ExpenseRepository.findAll()
5. Repository queries database
6. Data flows back: Database → Repository → Service → Controller
7. Controller returns: List<ExpenseDTO>
8. Spring converts to JSON: [{...}, {...}, {...}]
9. Client receives: JSON array
```

### **2.4 Method 2: Search by Merchant (READ with Query)**

```java
@GetMapping("/search")  // domain:port/api/expenses/search?merchant=Walmart
public List<ExpenseDTO> search(@RequestParam String merchant) {
    return service.searchByExpenseMerchant(merchant);
}
```

**Breaking It Down:**

**@GetMapping("/search"):**
- **URL**: `/api/expenses/search`
- **Note**: The `/search` is appended to base URL

**@RequestParam String merchant:**
- **What it does**: Extracts query parameter from URL
- **Example URL**: `/api/expenses/search?merchant=Walmart`
- **Result**: `merchant = "Walmart"`

**Request Flow:**
```
1. Client: GET /api/expenses/search?merchant=Walmart
2. Spring extracts: merchant = "Walmart"
3. Routes to: ExpenseController.search("Walmart")
4. Controller calls: ExpenseService.searchByExpenseMerchant("Walmart")
5. Service calls: ExpenseRepository.findByExpenseMerchant("Walmart")
6. Repository queries: WHERE expenseMerchant = 'Walmart'
7. Returns filtered list
```

### **2.5 Method 3: Create Expense (CREATE)**

```java
@PostMapping
public ExpenseDTO create(@RequestBody ExpenseWOIDDTO expensedto) {
    return service.create(expensedto);
}
```

**Breaking It Down:**

**@PostMapping:**
- **HTTP Method**: POST
- **URL**: `/api/expenses` (base URL)
- **Purpose**: Create new resource

**@RequestBody ExpenseWOIDDTO:**
- **What it does**: Converts JSON request body to Java object
- **Why ExpenseWOIDDTO?**: No ID needed when creating (database generates it)

**Example Request:**
```json
POST /api/expenses
Content-Type: application/json

{
  "expenseDate": "2024-01-15",
  "expenseValue": 50.00,
  "expenseMerchant": "Walmart"
}
```

**Request Flow:**
```
1. Client sends: POST /api/expenses with JSON body
2. Spring converts JSON → ExpenseWOIDDTO object
3. Routes to: ExpenseController.create(expenseWOIDDTO)
4. Controller calls: ExpenseService.create(expenseWOIDDTO)
5. Service creates: Expense entity (with generated ID)
6. Service saves: ExpenseRepository.save(expense)
7. Database generates ID and saves
8. Service converts: Expense → ExpenseDTO (now with ID)
9. Controller returns: ExpenseDTO with ID
10. Spring converts to JSON
11. Client receives: Created expense with ID
```

**Why ExpenseWOIDDTO?**
- When creating, client doesn't know the ID yet
- Database generates the ID
- We return the created expense with its new ID

### **2.6 Method 4: Get by ID (READ One)**

```java
@GetMapping("/{id}")
public ExpenseDTO getById(@PathVariable String id){
    return service.getById(id);
}
```

**Breaking It Down:**

**@GetMapping("/{id}"):**
- **URL Pattern**: `/api/expenses/{id}`
- **`{id}`**: Path variable placeholder
- **Example**: `/api/expenses/abc123` → `id = "abc123"`

**@PathVariable String id:**
- **What it does**: Extracts `{id}` from URL path
- **Example**: URL `/api/expenses/abc123` → `id = "abc123"`

**Request Flow:**
```
1. Client: GET /api/expenses/abc123
2. Spring extracts: id = "abc123" from URL path
3. Routes to: ExpenseController.getById("abc123")
4. Controller calls: ExpenseService.getById("abc123")
5. Service calls: ExpenseRepository.findById("abc123")
6. Repository queries: WHERE id = 'abc123'
7. Returns: Expense (or null if not found)
8. Service converts: Expense → ExpenseDTO
9. Controller returns: ExpenseDTO
10. Client receives: Single expense JSON object
```

### **2.7 Method 5: Update Expense (UPDATE)**

```java
@PutMapping("/{id}")
public ExpenseDTO update(@PathVariable String id, @RequestBody ExpenseDTO dto) {
    return service.update(id, dto);
}
```

**Breaking It Down:**

**@PutMapping("/{id}"):**
- **HTTP Method**: PUT
- **URL**: `/api/expenses/{id}`
- **Purpose**: Update entire resource

**Two Parameters:**
1. **@PathVariable String id**: ID from URL (`/api/expenses/abc123`)
2. **@RequestBody ExpenseDTO dto**: Updated data from JSON body

**Example Request:**
```json
PUT /api/expenses/abc123
Content-Type: application/json

{
  "expenseId": "abc123",
  "expenseDate": "2024-01-20",
  "expenseValue": 75.00,
  "expenseMerchant": "Target"
}
```

**Request Flow:**
```
1. Client: PUT /api/expenses/abc123 with JSON body
2. Spring extracts: id = "abc123" from URL
3. Spring converts: JSON body → ExpenseDTO
4. Routes to: ExpenseController.update("abc123", expenseDTO)
5. Controller calls: ExpenseService.update("abc123", expenseDTO)
6. Service finds: ExpenseRepository.findById("abc123")
7. Service updates: expense.setDate(...), expense.setValue(...), etc.
8. Service saves: ExpenseRepository.save(updatedExpense)
9. Service converts: Expense → ExpenseDTO
10. Controller returns: Updated ExpenseDTO
11. Client receives: Updated expense JSON
```

**PUT vs PATCH:**
- **PUT**: Update entire resource (all fields)
- **PATCH**: Update partial resource (only changed fields)
- This code uses PUT (updates all fields)

### **2.8 Method 6: Delete Expense (DELETE)**

```java
@DeleteMapping("/{id}")
public void delete(@PathVariable String id) {
    service.delete(id);
}
```

**Breaking It Down:**

**@DeleteMapping("/{id}"):**
- **HTTP Method**: DELETE
- **URL**: `/api/expenses/{id}`
- **Purpose**: Remove resource

**Return Type: `void`:**
- No return value (resource is deleted)
- Spring returns HTTP 200 OK by default
- **Best Practice**: Should return 204 No Content (we'll see how)

**Request Flow:**
```
1. Client: DELETE /api/expenses/abc123
2. Spring extracts: id = "abc123"
3. Routes to: ExpenseController.delete("abc123")
4. Controller calls: ExpenseService.delete("abc123")
5. Service calls: ExpenseRepository.deleteById("abc123")
6. Repository deletes: DELETE FROM expenses WHERE id = 'abc123'
7. Controller returns: void (nothing)
8. Spring returns: HTTP 200 OK (or 204 No Content if configured)
```

### **2.9 Controller Summary**

**What the Controller Does:**
1. ✅ Receives HTTP requests
2. ✅ Extracts parameters (path variables, request params, request body)
3. ✅ Delegates to Service layer (no business logic here!)
4. ✅ Returns DTOs (converted to JSON automatically)

**What the Controller Does NOT Do:**
1. ❌ Business logic (that's Service layer)
2. ❌ Database queries (that's Repository layer)
3. ❌ Data conversion (Service handles Entity ↔ DTO)

**Key Pattern:**
```
HTTP Request → Controller → Service → Repository → Database
                                    ↓
HTTP Response ← Controller ← Service ← Repository ← Database
```

---

## 🔧 **PART 3: ExpenseService.java - Deep Dive**

The Service layer contains **business logic** and coordinates between Controller and Repository.

### **3.1 Class-Level Annotation**

```java
@Service
public class ExpenseService {
```

**@Service:**
- **What it does**: Marks this class as a Spring service
- **Effect**: Spring creates and manages this class (singleton)
- **Why**: Allows dependency injection into Controller

**Service Layer Responsibilities:**
1. Business logic (validation, calculations, rules)
2. Converting between Entity and DTO
3. Coordinating multiple repository calls
4. Transaction management

### **3.2 Dependency Injection**

```java
private final ExpenseRepository repository;

public ExpenseService(ExpenseRepository repository) {
    this.repository = repository;
}
```

**What's Happening:**
- Spring injects `ExpenseRepository` via constructor
- Service uses repository to access database
- **Pattern**: Controller → Service → Repository

### **3.3 Method 1: getAllExpenses() - Convert Entities to DTOs**

```java
public List<ExpenseDTO> getAllExpenses() {
    // the repo method returns a list of expenses...
    // we need to convert every expense on the list to a DTO...
    // keep/put back in a list to return
    return repository.findAll().stream().map(this::ExpenseToDto).toList();
}
```

**Breaking It Down:**

**Step 1: `repository.findAll()`**
- Calls repository method
- Returns: `List<Expense>` (entities from database)

**Step 2: `.stream()`**
- Converts list to stream (for processing)

**Step 3: `.map(this::ExpenseToDto)`**
- Maps each `Expense` entity to `ExpenseDTO`
- `this::ExpenseToDto` is a method reference to the private helper method

**Step 4: `.toList()`**
- Collects stream back into `List<ExpenseDTO>`

**Why Convert Entity to DTO?**
- **Entity (`Expense`)**: Contains database details, relationships, internal fields
- **DTO (`ExpenseDTO`)**: Only contains data client needs, no internal details
- **Security**: Don't expose internal structure to clients
- **Flexibility**: Can change database structure without breaking API

**Flow:**
```
1. Repository returns: List<Expense> (entities)
2. Stream processes each Expense
3. ExpenseToDto() converts: Expense → ExpenseDTO
4. Returns: List<ExpenseDTO>
```

### **3.4 Method 2: searchByExpenseMerchant() - Filtered Search**

```java
public List<ExpenseDTO> searchByExpenseMerchant(String merchant) {
    return repository.findByExpenseMerchant(merchant).stream().map(this::ExpenseToDto).toList();
}
```

**Breaking It Down:**

**Step 1: `repository.findByExpenseMerchant(merchant)`**
- Custom repository method (we'll see this in Repository section)
- Returns: `List<Expense>` where merchant matches

**Step 2-4: Same conversion as getAllExpenses()**
- Convert entities to DTOs
- Return list

**Flow:**
```
1. Service receives: merchant = "Walmart"
2. Repository queries: WHERE expenseMerchant = 'Walmart'
3. Returns: List<Expense> (filtered)
4. Service converts: List<Expense> → List<ExpenseDTO>
5. Returns: Filtered DTOs
```

### **3.5 Method 3: create() - Create New Expense**

```java
public ExpenseDTO create(ExpenseWOIDDTO dto) {
    Expense entity = new Expense(dto.expenseDate(), dto.expenseValue(), dto.expenseMerchant());
    return ExpenseToDto(repository.save(entity));
}
```

**Breaking It Down:**

**Step 1: Create Entity from DTO**
```java
Expense entity = new Expense(
    dto.expenseDate(),      // From DTO
    dto.expenseValue(),     // From DTO
    dto.expenseMerchant()   // From DTO
);
```
- Creates new `Expense` entity
- **No ID yet** - database will generate it

**Step 2: Save to Database**
```java
repository.save(entity)
```
- Saves entity to database
- Database generates ID
- Returns: `Expense` with ID now set

**Step 3: Convert Back to DTO**
```java
ExpenseToDto(repository.save(entity))
```
- Converts saved entity (now with ID) to DTO
- Returns DTO with generated ID

**Why This Pattern?**
1. Client sends DTO without ID
2. Service creates Entity
3. Database generates ID
4. Service returns DTO with ID

**Flow:**
```
1. Service receives: ExpenseWOIDDTO (no ID)
2. Service creates: Expense entity (no ID)
3. Repository saves: Database generates ID
4. Repository returns: Expense (with ID)
5. Service converts: Expense → ExpenseDTO (with ID)
6. Returns: ExpenseDTO with generated ID
```

### **3.6 Method 4: getById() - Find One Expense**

```java
public ExpenseDTO getById(String id) {
    Optional<Expense> res = repository.findById(id);
    return (res.isEmpty()) ? null : ExpenseToDto(res.get());
}
```

**Breaking It Down:**

**Step 1: `repository.findById(id)`**
- Returns: `Optional<Expense>`
- **Optional**: May or may not contain an Expense
- **Why Optional?**: Expense might not exist in database

**Step 2: Check if Empty**
```java
res.isEmpty() ? null : ExpenseToDto(res.get())
```
- **If empty**: Return `null` (expense not found)
- **If present**: Convert to DTO and return

**Optional Explained:**
- `Optional<Expense>`: Container that may or may not have an Expense
- `res.isEmpty()`: True if no Expense found
- `res.get()`: Gets the Expense from Optional

**Flow:**
```
1. Service receives: id = "abc123"
2. Repository queries: WHERE id = 'abc123'
3. Returns: Optional<Expense>
   - If found: Optional contains Expense
   - If not found: Optional is empty
4. Service checks: Is Optional empty?
   - If empty: Return null
   - If present: Convert Expense → ExpenseDTO and return
```

**Note**: This could be improved with exception handling (we'll see this in update method)

### **3.7 Method 5: update() - Update Existing Expense**

```java
public ExpenseDTO update(String id, ExpenseDTO dto) {
    Expense expense = repository.findById(id).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
    
    expense.setDate(dto.expenseDate());
    expense.setValue(dto.expenseValue());
    expense.setMerchant(dto.expenseMerchant());
    
    return ExpenseToDto(repository.save(expense));
}
```

**Breaking It Down:**

**Step 1: Find Expense or Throw Exception**
```java
Expense expense = repository.findById(id)
    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
```
- Finds expense by ID
- **If not found**: Throws `ResponseStatusException` with 404 status
- **If found**: Returns Expense entity

**Step 2: Update Entity Fields**
```java
expense.setDate(dto.expenseDate());
expense.setValue(dto.expenseValue());
expense.setMerchant(dto.expenseMerchant());
```
- Updates all fields from DTO
- Modifies the entity object

**Step 3: Save and Convert**
```java
return ExpenseToDto(repository.save(expense));
```
- Saves updated entity
- Converts to DTO
- Returns updated DTO

**Why orElseThrow()?**
- Better error handling than returning null
- Returns proper HTTP 404 status
- Client knows resource doesn't exist

**Flow:**
```
1. Service receives: id = "abc123", ExpenseDTO with updates
2. Repository finds: Expense with id = "abc123"
   - If not found: Throw 404 exception
   - If found: Continue
3. Service updates: expense.setDate(...), setValue(...), setMerchant(...)
4. Repository saves: Updated expense
5. Service converts: Expense → ExpenseDTO
6. Returns: Updated ExpenseDTO
```

### **3.8 Method 6: delete() - Remove Expense**

```java
public void delete(String id) {
    repository.deleteById(id);
}
```

**Breaking It Down:**

**Simple Deletion:**
- Calls repository to delete by ID
- No return value (void)
- **Note**: Doesn't check if expense exists first
- If ID doesn't exist, repository does nothing (no error)

**Flow:**
```
1. Service receives: id = "abc123"
2. Repository deletes: DELETE FROM expenses WHERE id = 'abc123'
3. Service returns: void (nothing)
```

**Potential Improvement:**
- Could check if exists first
- Could throw exception if not found
- Current implementation: Silent failure if ID doesn't exist

### **3.9 Helper Method: ExpenseToDto() - Entity to DTO Conversion**

```java
private ExpenseDTO ExpenseToDto(Expense expense) {
    return new ExpenseDTO(
        expense.getId(),
        expense.getDate(),
        expense.getValue(),
        expense.getMerchant()
    );
}
```

**Breaking It Down:**

**Purpose:**
- Converts `Expense` entity to `ExpenseDTO`
- **Private**: Only used within this class
- **Reusable**: Used by multiple methods

**Why This Method Exists:**
- **DRY Principle**: Don't Repeat Yourself
- All methods need this conversion
- Centralized conversion logic
- Easy to change if DTO structure changes

**Conversion:**
```
Expense Entity          →    ExpenseDTO
─────────────────────────────────────────
expense.getId()        →    expenseId
expense.getDate()       →    expenseDate
expense.getValue()      →    expenseValue
expense.getMerchant()   →    expenseMerchant
```

### **3.10 Service Layer Summary**

**What Service Does:**
1. ✅ Business logic (validation, calculations)
2. ✅ Entity ↔ DTO conversion
3. ✅ Coordinates repository calls
4. ✅ Error handling (exceptions)

**What Service Does NOT Do:**
1. ❌ Handle HTTP requests (that's Controller)
2. ❌ Direct database access (that's Repository)
3. ❌ Know about URLs or HTTP methods

**Key Pattern:**
```
Controller (HTTP) → Service (Business Logic) → Repository (Database)
```

---

## 🗄️ **PART 4: ExpenseRepository.java - Deep Dive**

The Repository layer handles **data access** - all database operations.

### **4.1 Interface Declaration**

```java
public interface ExpenseRepository extends JpaRepository<Expense, String> {
```

**Breaking It Down:**

**`public interface ExpenseRepository`:**
- **Interface**: Defines methods, doesn't implement them
- **Spring Magic**: Spring Data JPA creates the implementation automatically!

**`extends JpaRepository<Expense, String>`:**
- **JpaRepository**: Spring Data JPA interface
- **`<Expense, String>`**: 
  - `Expense`: Entity type (what we're storing)
  - `String`: ID type (primary key type)

**What JpaRepository Provides:**
Spring automatically provides these methods:
- `save(Expense)` - Save entity
- `findById(String)` - Find by ID
- `findAll()` - Find all
- `deleteById(String)` - Delete by ID
- `count()` - Count entities
- And many more!

**You Don't Write These:**
```java
// You DON'T need to write this - Spring provides it!
public Expense findById(String id) {
    // SQL: SELECT * FROM expenses WHERE id = ?
    // Spring generates this automatically!
}
```

### **4.2 Custom Query Method**

```java
List<Expense> findByExpenseMerchant(String merchant);
```

**Breaking It Down:**

**Method Name Convention:**
- `findBy` - Spring knows this is a query
- `ExpenseMerchant` - Field name in Expense entity
- Spring generates SQL: `SELECT * FROM expenses WHERE expenseMerchant = ?`

**How Spring Generates Query:**
1. Reads method name: `findByExpenseMerchant`
2. Parses: "find By ExpenseMerchant"
3. Generates: `WHERE expenseMerchant = ?`
4. Parameter: `String merchant` becomes the `?` value

**Equivalent SQL:**
```sql
SELECT * FROM expenses WHERE expenseMerchant = ?
```

**Spring Does This Automatically:**
- No SQL writing needed!
- No implementation needed!
- Just name the method correctly

**Other Examples:**
```java
// Spring generates: WHERE expenseValue > ?
List<Expense> findByExpenseValueGreaterThan(BigDecimal value);

// Spring generates: WHERE expenseMerchant = ? AND expenseValue > ?
List<Expense> findByExpenseMerchantAndExpenseValueGreaterThan(String merchant, BigDecimal value);

// Spring generates: ORDER BY expenseDate DESC
List<Expense> findByOrderByExpenseDateDesc();
```

### **4.3 Commented Code**

```java
//    Expense findById(String id);
//    @Query("SELECT * FROM expenses WHERE expenseMerchant = merchant")
```

**What This Shows:**
- `findById` is already provided by `JpaRepository` - no need to declare it
- `@Query` is an alternative way to write custom queries (we'll see this later)

### **4.4 Repository Summary**

**What Repository Does:**
1. ✅ Database operations (CRUD)
2. ✅ Query generation (from method names)
3. ✅ Entity management

**What Repository Does NOT Do:**
1. ❌ Business logic (that's Service)
2. ❌ HTTP handling (that's Controller)
3. ❌ DTO conversion (that's Service)

**Key Pattern:**
```
Service → Repository → Database
```

**Spring Magic:**
- You write: `List<Expense> findByExpenseMerchant(String merchant);`
- Spring creates: Full implementation with SQL query
- You use: `repository.findByExpenseMerchant("Walmart")`
- Spring executes: Database query automatically

---

## 🔄 **PART 5: Complete Request Flow Example**

Let's trace a complete request from start to finish:

### **Example: Creating an Expense**

**1. Client Request:**
```http
POST http://localhost:8080/api/expenses
Content-Type: application/json

{
  "expenseDate": "2024-01-15",
  "expenseValue": 50.00,
  "expenseMerchant": "Walmart"
}
```

**2. Spring MVC Receives Request:**
- DispatcherServlet receives POST to `/api/expenses`
- HandlerMapping finds: `ExpenseController.create()`

**3. Spring Converts JSON:**
- HttpMessageConverter reads JSON body
- Converts to `ExpenseWOIDDTO` object:
  ```java
  ExpenseWOIDDTO(
      expenseDate = LocalDate.of(2024, 1, 15),
      expenseValue = BigDecimal(50.00),
      expenseMerchant = "Walmart"
  )
  ```

**4. Controller Method:**
```java
@PostMapping
public ExpenseDTO create(@RequestBody ExpenseWOIDDTO expensedto) {
    return service.create(expensedto);  // ← Calls Service
}
```

**5. Service Method:**
```java
public ExpenseDTO create(ExpenseWOIDDTO dto) {
    // Create entity from DTO
    Expense entity = new Expense(
        dto.expenseDate(),      // 2024-01-15
        dto.expenseValue(),     // 50.00
        dto.expenseMerchant()   // "Walmart"
    );
    // entity has no ID yet
    
    // Save to database
    Expense saved = repository.save(entity);
    // Database generates ID: "abc123"
    // saved now has ID = "abc123"
    
    // Convert back to DTO
    return ExpenseToDto(saved);
    // Returns ExpenseDTO with ID = "abc123"
}
```

**6. Repository Save:**
```java
// Spring executes:
// INSERT INTO expenses (expenseDate, expenseValue, expenseMerchant)
// VALUES ('2024-01-15', 50.00, 'Walmart')
// Database generates ID: "abc123"
// Returns Expense with ID = "abc123"
```

**7. Service Converts to DTO:**
```java
private ExpenseDTO ExpenseToDto(Expense expense) {
    return new ExpenseDTO(
        expense.getId(),        // "abc123"
        expense.getDate(),      // 2024-01-15
        expense.getValue(),     // 50.00
        expense.getMerchant()   // "Walmart"
    );
}
```

**8. Controller Returns:**
```java
return ExpenseDTO(...);  // Returns DTO with ID
```

**9. Spring Converts to JSON:**
```json
{
  "expenseId": "abc123",
  "expenseDate": "2024-01-15",
  "expenseValue": 50.00,
  "expenseMerchant": "Walmart"
}
```

**10. HTTP Response:**
```http
HTTP/1.1 200 OK
Content-Type: application/json

{
  "expenseId": "abc123",
  "expenseDate": "2024-01-15",
  "expenseValue": 50.00,
  "expenseMerchant": "Walmart"
}
```

**Complete Flow Diagram:**
```
Client
  ↓ POST /api/expenses + JSON
DispatcherServlet
  ↓ Routes to
ExpenseController.create(ExpenseWOIDDTO)
  ↓ Calls
ExpenseService.create(ExpenseWOIDDTO)
  ↓ Creates Entity
Expense entity (no ID)
  ↓ Saves
ExpenseRepository.save(Expense)
  ↓ Executes SQL
Database INSERT
  ↓ Generates ID
Expense entity (ID = "abc123")
  ↓ Converts
ExpenseService.ExpenseToDto(Expense)
  ↓ Returns
ExpenseDTO (with ID)
  ↓ Converts to JSON
Spring HttpMessageConverter
  ↓ Sends
HTTP Response (JSON with ID)
  ↓
Client receives created expense
```

---

## 📝 **PART 6: Key Takeaways for Interview**

### **6.1 CRUD Operations Summary**

| Operation | HTTP Method | Controller Annotation | URL Pattern | Request Body | Response |
|-----------|-------------|----------------------|-------------|--------------|----------|
| **Create** | POST | `@PostMapping` | `/api/expenses` | ExpenseWOIDDTO | ExpenseDTO |
| **Read All** | GET | `@GetMapping` | `/api/expenses` | None | List<ExpenseDTO> |
| **Read One** | GET | `@GetMapping("/{id}")` | `/api/expenses/{id}` | None | ExpenseDTO |
| **Update** | PUT | `@PutMapping("/{id}")` | `/api/expenses/{id}` | ExpenseDTO | ExpenseDTO |
| **Delete** | DELETE | `@DeleteMapping("/{id}")` | `/api/expenses/{id}` | None | void |

### **6.2 Layer Responsibilities**

| Layer | Responsibility | Example |
|-------|---------------|---------|
| **Controller** | HTTP handling, routing | `@GetMapping`, `@PostMapping` |
| **Service** | Business logic, conversions | Entity ↔ DTO conversion |
| **Repository** | Database access | `findAll()`, `save()`, `deleteById()` |

### **6.3 Key Annotations**

| Annotation | Purpose | Where Used |
|------------|---------|------------|
| `@RestController` | REST API controller | Controller class |
| `@RequestMapping` | Base URL mapping | Controller class |
| `@GetMapping` | Handle GET requests | Controller methods |
| `@PostMapping` | Handle POST requests | Controller methods |
| `@PutMapping` | Handle PUT requests | Controller methods |
| `@DeleteMapping` | Handle DELETE requests | Controller methods |
| `@PathVariable` | Extract from URL path | Method parameters |
| `@RequestParam` | Extract from query string | Method parameters |
| `@RequestBody` | Extract from request body | Method parameters |
| `@Service` | Mark as service layer | Service class |
| `@Entity` | Mark as database entity | Model class |
| `JpaRepository` | Data access interface | Repository interface |

### **6.4 Common Interview Questions**

**Q: What's the difference between @Controller and @RestController?**
- **A**: `@RestController` = `@Controller` + `@ResponseBody`. `@RestController` automatically converts return values to JSON.

**Q: What's the difference between @PathVariable and @RequestParam?**
- **A**: `@PathVariable` extracts from URL path (`/api/expenses/{id}`), `@RequestParam` extracts from query string (`?merchant=Walmart`).

**Q: Why do we use DTOs instead of returning Entities directly?**
- **A**: DTOs expose only necessary data, hide internal structure, provide flexibility to change database without breaking API, and improve security.

**Q: How does Spring Data JPA generate queries?**
- **A**: Spring analyzes method names like `findByExpenseMerchant` and automatically generates SQL queries based on naming conventions.

**Q: What's the flow of a REST request?**
- **A**: Client → DispatcherServlet → HandlerMapping → Controller → Service → Repository → Database, then response flows back.

---

## ✅ **Practice Exercises**

1. **Trace the flow** for `GET /api/expenses/abc123`:
   - Which controller method handles it?
   - What does the service do?
   - What does the repository do?
   - What's returned to the client?

2. **Identify the annotations** in `ExpenseController`:
   - What does each annotation do?
   - Why is `@RestController` used instead of `@Controller`?
   - What's the difference between `@GetMapping` and `@GetMapping("/{id}")`?

3. **Explain the conversion**:
   - Why does `ExpenseService.getAllExpenses()` convert entities to DTOs?
   - What would happen if we returned entities directly?

4. **Repository methods**:
   - What methods does `JpaRepository` provide automatically?
   - How does Spring generate SQL for `findByExpenseMerchant`?

---

**Congratulations! You've completed Phase 1. You now understand:**
- ✅ How RESTful APIs work
- ✅ How Spring MVC handles requests
- ✅ How Controllers, Services, and Repositories interact
- ✅ How CRUD operations are implemented
- ✅ How data flows through the application

**Next Steps**: Move to Phase 2 to understand Spring Boot architecture and dependency injection!
