# Week 7 - Tuesday: Transaction Management & REST API Development

## 1. Transaction Management

A **Transaction** is a logical unit of work that contains one or more SQL statements. A transaction is atomic: either all statements succeed, or none of them do.

### Why Transactions Matter
Consider transferring money between bank accounts:
```java
// Without transactions - DANGEROUS!
public void transferMoney(Account from, Account to, double amount) {
    from.setBalance(from.getBalance() - amount);  // Step 1
    accountRepo.save(from);
    // ⚠️ If the system crashes here, money is deducted but never added!
    to.setBalance(to.getBalance() + amount);      // Step 2
    account Repo.save(to);
}
```

**With transactions**, both operations succeed together or fail together.

---

## 2. ACID Properties of Transactions

The ACID properties ensure database reliability and consistency.

| Property | Description | Example |
| :--- | :--- | :--- |
| **Atomicity** | All or nothing. If one part fails, the entire transaction rolls back. | Both debit and credit must succeed. If credit fails, debit is undone. |
| **Consistency** | The database moves from one valid state to another. Rules/constraints are enforced. | Account balance cannot go negative (if constrained). |
| **Isolation** | Transactions occurring at the same time do not interfere with each other. | If two users withdraw money simultaneously, each sees consistent data. |
| **Durability** | Once committed, changes are permanent (saved to disk, survive crashes). | After commit, the transfer is saved even if the server reboots. |

### Isolation Levels

Different isolation levels balance **consistency** vs. **performance**.

| Level | Description | Dirty Read | Non-Repeatable Read | Phantom Read |
| :--- | :--- | :---: | :---: | :---: |
| **READ_UNCOMMITTED** | Can read uncommitted changes from other transactions | ✅ Possible | ✅ Possible | ✅ Possible |
| **READ_COMMITTED** (Default) | Only reads committed data | ❌ Not possible | ✅ Possible | ✅ Possible |
| **REPEATABLE_READ** | Same data is returned if read multiple times in same transaction | ❌ Not possible | ❌ Not possible | ✅ Possible |
| **SERIALIZABLE** | Full isolation, transactions execute serially | ❌ Not possible | ❌ Not possible | ❌ Not possible |

**Definitions**:
-   **Dirty Read**: Reading uncommitted changes from another transaction.
-   **Non-Repeatable Read**: Same query returns different results within the same transaction (due to UPDATEs).
-   **Phantom Read**: Same query returns different rows within the same transaction (due to INSERTs/DELETEs).

---

## 3. Spring's @Transactional Annotation

In Spring, we manage transactions **declaratively** using the `@Transactional` annotation.

### How It Works
-   Spring wraps the method in a **proxy**.
-   **On Entry**: Opens a transaction (or joins an existing one).
-   **On Normal Exit**: Commits the transaction.
-   **On Exception**: Rolls back the transaction.

### Basic Usage
```java
@Service
public class BankService {
    
    @Autowired
    private AccountRepository accountRepo;
    
    @Transactional
    public void transferMoney(Long fromId, Long toId, Double amount) {
        Account from = accountRepo.findById(fromId)
                .orElseThrow(() -> new AccountNotFoundException(fromId));
        Account to = accountRepo.findById(toId)
                .orElseThrow(() -> new AccountNotFoundException(toId));
        
        from.setBalance(from.getBalance() - amount);
        to.setBalance(to.getBalance() + amount);
        
        accountRepo.save(from);
        // If an error happens anywhere, BOTH saves are undone
        accountRepo.save(to);
    }
}
```

### @Transactional Attributes

```java
@Transactional(
    propagation = Propagation.REQUIRED,
    isolation = Isolation.READ_COMMITTED,
    timeout = 30,
    readOnly = false,
    rollbackFor = Exception.class,
    noRollbackFor = IllegalArgumentException.class
)
public void complexTransaction() {
    // Transaction logic
}
```

| Attribute | Description | Example Values |
| :--- | :--- | :--- |
| `propagation` | How the transaction behaves when called from another transactional method | `REQUIRED`, `REQUIRES_NEW`, `NESTED` |
| `isolation` | Isolation level for this transaction | `READ_COMMITTED`, `REPEATABLE_READ` |
| `timeout` | Maximum seconds before transaction automatically rolls back | `30` (seconds) |
| `readOnly` | Optimization hint for read-only transactions | `true` or `false` |
| `rollbackFor` | Exception classes that trigger rollback (in addition to RuntimeException) | `Exception.class` |
| `noRollbackFor` | Exception classes that should NOT trigger rollback | `IllegalArgumentException.class` |

### Default Rollback Behavior
-   **RuntimeException** (unchecked): Triggers rollback automatically.
-   **CheckedException** (e.g., IOException): Does NOT trigger rollback by default.
-   **Solution**: Use `rollbackFor = Exception.class` to include checked exceptions.

```java
@Transactional(rollbackFor = Exception.class)
public void saveUser(User user) throws IOException {
    userRepo.save(user);
    // If IOException is thrown, transaction will rollback
    fileService.writeToFile(user.toString());
}
```

---

## 4. Transaction Propagation Strategies

Propagation defines how a transaction boundary interacts with other transaction boundaries.

### Common Propagation Types

#### REQUIRED (Default)
-   **Behavior**: Support a current transaction. Create a new one if none exists.
-   **Use Case**: Most common scenario.

```java
@Transactional(propagation = Propagation.REQUIRED)
public void methodA() {
    // Creates new transaction
    methodB();  // Joins methodA's transaction
}

@Transactional(propagation = Propagation.REQUIRED)
public void methodB() {
    // Uses existing transaction from methodA
}
```

#### REQUIRES_NEW
-   **Behavior**: Always create a new transaction. Suspend the current transaction if one exists.
-   **Use Case**: Logging or audit operations that must succeed even if the main transaction fails.

```java
@Transactional
public void businessOperation() {
    // Main transaction
    performWork();
    auditLogger.log("Work performed");  // REQUIRES_NEW
    // If performWork() fails, the log still persists
}

@Transactional(propagation = Propagation.REQUIRES_NEW)
public void log(String message) {
    // New independent transaction
    auditRepo.save(new AuditLog(message));
}
```

#### MANDATORY
-   **Behavior**: Must run within an existing transaction. Throw exception if none exists.
-   **Use Case**: Methods that should never be called outside a transaction.

```java
@Transactional(propagation = Propagation.MANDATORY)
public void updateBalance(Account account) {
    // This method REQUIRES a transaction to exist
    // Throws exception if called outside @Transactional context
}
```

#### SUPPORTS
-   **Behavior**: Support a current transaction if exists. Execute non-transactionally if none exists.
-   **Use Case**: Read operations that don't require transactions.

```java
@Transactional(propagation = Propagation.SUPPORTS, readOnly = true)
public User findUser(Long id) {
    return userRepo.findById(id).orElse(null);
}
```

#### NOT_SUPPORTED
-   **Behavior**: Execute non-transactionally. Suspend the current transaction if one exists.
-   **Use Case**: Operations that should never be transactional (e.g., sending email).

#### NEVER
-   **Behavior**: Execute non-transactionally. Throw exception if a transaction exists.
-   **Use Case**: Ensure method is never called within a transaction.

#### NESTED
-   **Behavior**: Execute within a nested transaction if a current transaction exists.
-   **Use Case**: Savepoints within a larger transaction.

### Propagation Summary Table

| Propagation | Existing Transaction | No Transaction |
| :--- | :--- | :--- |
| **REQUIRED** | Join it | Create new |
| **REQUIRES_NEW** | Suspend it, create new | Create new |
| **MANDATORY** | Join it | Throw exception |
| **SUPPORTS** | Join it | Execute without transaction |
| **NOT_SUPPORTED** | Suspend it | Execute without transaction |
| **NEVER** | Throw exception | Execute without transaction |
| **NESTED** | Create nested | Create new |

---

## 5. REST Controller Refinements

We covered basic MVC in Week 6. Now we dive into fine-grained control over HTTP responses.

### @RequestMapping & Variants

#### @RequestMapping
Base annotation for mapping HTTP requests. Can be used at class and method level.

```java
@RestController
@RequestMapping("/api/v1/users")  // Base path
public class UserController {
    
    @RequestMapping(
        value = "/{id}",
        method = RequestMethod.GET,
        produces = MediaType.APPLICATION_JSON_VALUE
    )
    public User getUser(@PathVariable Long id) {
        return userService.findById(id);
    }
}
```

#### Shortcut Annotations
```java
@GetMapping("/{id}")        // GET requests
@PostMapping                // POST requests
@PutMapping("/{id}")        // PUT requests
@DeleteMapping("/{id}")     // DELETE requests
@PatchMapping("/{id}")      // PATCH requests
```

### @ResponseBody
-   Tells Spring to serialize the return object into JSON (using Jackson).
-   Writes directly to HTTP Response Body.
-   **@RestController** = **@Controller** + **@ResponseBody** (applied to all methods).

```java
@Controller
public class UserController {
    
    @GetMapping("/users/{id}")
    @ResponseBody  // Required if using @Controller instead of @RestController
    public User getUser(@PathVariable Long id) {
        return userService.findById(id);
    }
}

// Equivalent using @RestController
@RestController
public class UserController {
    
    @GetMapping("/users/{id}")
    // @ResponseBody is implicit
    public User getUser(@PathVariable Long id) {
        return userService.findById(id);
    }
}
```

---

## 6. ResponseEntity Class

Returning a raw object (like `User`) implies a standard `200 OK` status. To control **headers**, **status codes**, and **body**, return a `ResponseEntity`.

### Basic Usage

```java
@GetMapping("/{id}")
public ResponseEntity<User> getUser(@PathVariable Long id) {
    Optional<User> userOpt = userService.findById(id);
    
    if (userOpt.isPresent()) {
        return ResponseEntity.ok(userOpt.get());  // 200 OK
    } else {
        return ResponseEntity.notFound().build();  // 404 Not Found
    }
}
```

### Common ResponseEntity Patterns

#### 200 OK
```java
@GetMapping
public ResponseEntity<List<User>> getAllUsers() {
    List<User> users = userService.findAll();
    return ResponseEntity.ok(users);
}
```

#### 201 CREATED
```java
@PostMapping
public ResponseEntity<User> createUser(@RequestBody User user) {
    User saved = userService.save(user);
    
    // Build Location header: /api/users/123
    URI location = ServletUriComponentsBuilder
            .fromCurrentRequest()
            .path("/{id}")
            .buildAndExpand(saved.getId())
            .toUri();
    
    return ResponseEntity.created(location).body(saved);
}
```

#### 204 NO CONTENT
```java
@DeleteMapping("/{id}")
public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
    userService.delete(id);
    return ResponseEntity.noContent().build();  // 204 No Content
}
```

#### 404 NOT FOUND
```java
@GetMapping("/{id}")
public ResponseEntity<User> getUser(@PathVariable Long id) {
    return userService.findById(id)
            .map(ResponseEntity::ok)                    // 200 if present
            .orElse(ResponseEntity.notFound().build()); // 404 if absent
}
```

#### 400 BAD REQUEST
```java
@PostMapping
public ResponseEntity<String> createUser(@RequestBody User user) {
    if (user.getEmail() == null) {
        return ResponseEntity.badRequest().body("Email is required");
    }
    User saved = userService.save(user);
    return ResponseEntity.status(HttpStatus.CREATED).body(saved);
}
```

#### Custom Status and Headers
```java
@GetMapping("/{id}")
public ResponseEntity<User> getUser(@PathVariable Long id) {
    User user = userService.findById(id).orElseThrow();
    
    return ResponseEntity
            .status(HttpStatus.OK)
            .header("X-Custom-Header", "MyValue")
            .header("X-User-Level", user.getLevel().toString())
            .cacheControl(CacheControl.maxAge(60, TimeUnit.SECONDS))
            .body(user);
}
```

### Fluent Builder API
```java
return ResponseEntity
        .status(HttpStatus.CREATED)
        .header("LocationHeader", "/users/123")
        .contentType(MediaType.APPLICATION_JSON)
        .body(savedUser);

// Shorthand
return ResponseEntity.created(location).body(savedUser);
```

---

## 7. Exception Handling

### Local Exception Handling (@ExceptionHandler)

Handle exceptions within a single controller.

```java
@RestController
@RequestMapping("/api/users")
public class UserController {
    
    @GetMapping("/{id}")
    public User getUser(@PathVariable Long id) {
        return userService.findById(id)
                .orElseThrow(() -> new UserNotFoundException(id));
    }
    
    @ExceptionHandler(UserNotFoundException.class)
    public ResponseEntity<String> handleNotFound(UserNotFoundException ex) {
        return ResponseEntity
                .status(HttpStatus.NOT_FOUND)
                .body(ex.getMessage());
    }
}
```

### Global Exception Handling (@ControllerAdvice)

Handle exceptions across all controllers.

```java
@ControllerAdvice
public class GlobalExceptionHandler {
    
    @ExceptionHandler(UserNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleUserNotFound(UserNotFoundException ex) {
        ErrorResponse error = new ErrorResponse(
            HttpStatus.NOT_FOUND.value(),
            ex.getMessage(),
            LocalDateTime.now()
        );
        return new ResponseEntity<>(error, HttpStatus.NOT_FOUND);
    }
    
    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<ErrorResponse> handleBadRequest(IllegalArgumentException ex) {
        ErrorResponse error = new ErrorResponse(
            HttpStatus.BAD_REQUEST.value(),
            ex.getMessage(),
            LocalDateTime.now()
        );
        return new ResponseEntity<>(error, HttpStatus.BAD_REQUEST);
    }
    
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleGenericException(Exception ex) {
        ErrorResponse error = new ErrorResponse(
            HttpStatus.INTERNAL_SERVER_ERROR.value(),
            "An unexpected error occurred",
            LocalDateTime.now()
        );
        return new ResponseEntity<>(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
}

// Error Response DTO
public class ErrorResponse {
    private int status;
    private String message;
    private LocalDateTime timestamp;
    
    // Constructor, getters, setters
}
```

---

## 8. HTTP Status Codes

### Common Status Codes

| Code | Meaning | Usage |
| :--- | :--- | :--- |
| **200 OK** | Success | GET, PUT, PATCH successful |
| **201 CREATED** | Resource created | POST successful |
| **204 NO CONTENT** | Success, no content to return | DELETE successful |
| **400 BAD REQUEST** | Invalid input | Validation error |
| **401 UNAUTHORIZED** | Authentication required | Missing or invalid credentials |
| **403 FORBIDDEN** | Authenticated but not authorized | Insufficient permissions |
| **404 NOT FOUND** | Resource not found | Entity doesn't exist |
| **409 CONFLICT** | Conflict with current state | Duplicate email, concurrent modification |
| **500 INTERNAL SERVER ERROR** | Server error | Unhandled exception |

---

## 9. Complete REST API Example

```java
@RestController
@RequestMapping("/api/users")
public class UserController {
    
    @Autowired
    private UserService userService;
    
    // GET /api/users
    @GetMapping
    public ResponseEntity<List<User>> getAllUsers() {
        List<User> users = userService.findAll();
        return ResponseEntity.ok(users);
    }
    
    // GET /api/users/123
    @GetMapping("/{id}")
    public ResponseEntity<User> getUser(@PathVariable Long id) {
        return userService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    // POST /api/users
    @PostMapping
    public ResponseEntity<User> createUser(@Valid @RequestBody User user) {
        User saved = userService.save(user);
        
        URI location = ServletUriComponentsBuilder
                .fromCurrentRequest()
                .path("/{id}")
                .buildAndExpand(saved.getId())
                .toUri();
        
        return ResponseEntity.created(location).body(saved);
    }
    
    // PUT /api/users/123
    @PutMapping("/{id}")
    public ResponseEntity<User> updateUser(
            @PathVariable Long id,
            @Valid @RequestBody User user) {
        
        return userService.findById(id)
                .map(existing -> {
                    user.setId(id);
                    User updated = userService.save(user);
                    return ResponseEntity.ok(updated);
                })
                .orElse(ResponseEntity.notFound().build());
    }
    
    // DELETE /api/users/123
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        if (userService.existsById(id)) {
            userService.deleteById(id);
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }
    
    // GET /api/users/search?email=john@example.com
    @GetMapping("/search")
    public ResponseEntity<User> findByEmail(@RequestParam String email) {
        return userService.findByEmail(email)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}
```

---

## 10. Best Practices

### Transactions
1.  **Use @Transactional at the service layer**: Not at the repository or controller layer.
2.  **Keep transactions short**: Long transactions lock resources.
3.  **Read-only transactions**: Use `readOnly = true` for read operations (optimization hint).
4.  **Explicit rollback**: Specify `rollbackFor = Exception.class` if you want checked exceptions to trigger rollback.
5.  **Avoid calling @Transactional methods from within the same class**: Use a separate service bean.

### REST APIs
1.  **Use proper HTTP status codes**: Don't return 200 for errors.
2.  **Use ResponseEntity for control**: Fine-grained control over responses.
3.  **Return Location header for POST**: Include URI of created resource.
4.  **Use @ControllerAdvice**: Centralize exception handling.
5.  **Validate input**: Use `@Valid` and Bean Validation (@NotNull, @Size, etc.).
6.  **Version your APIs**: Use `/api/v1/` in paths for backward compatibility.

### Performance
1.  **Pagination**: Don't return thousands of records at once.
2.  **DTOs vs Entities**: Don't expose entities directly in REST APIs. Use DTOs to control serialization.
3.  **Lazy loading**: Be careful with lazy-loaded relationships (causes LazyInitializationException in REST APIs).
