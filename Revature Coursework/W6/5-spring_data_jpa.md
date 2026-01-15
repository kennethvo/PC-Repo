# Week 6 - Friday: Spring Data JPA & Transaction Management

## 1. Spring Data JPA Overview

### What is Spring Data JPA?

**Spring Data JPA** is a layer on top of JPA that simplifies data access by providing:
- Repository interfaces with automatic implementations
- Derived query methods (no SQL needed)
- Pagination and sorting
- Custom queries with @Query
- Auditing support

### Architecture

```
Application Code
       │
       ▼
┌─────────────────────────────────────┐
│        Repository Interface         │
│   (UserRepository extends JPA)      │
└─────────────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────┐
│       Spring Data JPA               │
│  (Generates implementation at       │
│   runtime using proxies)            │
└─────────────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────┐
│        JPA (EntityManager)          │
└─────────────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────┐
│   Hibernate (or other provider)     │
└─────────────────────────────────────┘
       │
       ▼
     Database
```

---

## 2. Spring Data Repositories

### Repository Hierarchy

```
Repository<T, ID>           (Marker interface)
       │
       ▼
CrudRepository<T, ID>       (Basic CRUD operations)
       │
       ▼
PagingAndSortingRepository  (Pagination and sorting)
       │
       ▼
JpaRepository<T, ID>        (JPA-specific operations)
```

### CrudRepository

Basic CRUD operations:

```java
public interface CrudRepository<T, ID> extends Repository<T, ID> {
    <S extends T> S save(S entity);
    <S extends T> Iterable<S> saveAll(Iterable<S> entities);
    Optional<T> findById(ID id);
    boolean existsById(ID id);
    Iterable<T> findAll();
    Iterable<T> findAllById(Iterable<ID> ids);
    long count();
    void deleteById(ID id);
    void delete(T entity);
    void deleteAll(Iterable<? extends T> entities);
    void deleteAll();
}
```

### JpaRepository

Extends CrudRepository with JPA-specific operations:

```java
public interface JpaRepository<T, ID> extends PagingAndSortingRepository<T, ID> {
    List<T> findAll();
    List<T> findAll(Sort sort);
    List<T> findAllById(Iterable<ID> ids);
    <S extends T> List<S> saveAll(Iterable<S> entities);
    void flush();
    <S extends T> S saveAndFlush(S entity);
    void deleteInBatch(Iterable<T> entities);
    void deleteAllInBatch();
    T getOne(ID id);  // Deprecated, use getReferenceById
    T getReferenceById(ID id);
}
```

### JpaRepository vs CrudRepository

| Feature | CrudRepository | JpaRepository |
|---------|---------------|---------------|
| findAll() return | Iterable | List |
| Batch operations | No | deleteInBatch, saveAll |
| Flushing | No | flush(), saveAndFlush() |
| Transactions | Auto | Auto |
| Best for | Simple CRUD | Full JPA features |

### Creating a Repository

```java
@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    // Spring Data JPA generates implementation automatically!
    // All CRUD methods available immediately
}
```

**Usage**:
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
    
    public List<User> findAll() {
        return userRepository.findAll();
    }
    
    public User save(User user) {
        return userRepository.save(user);
    }
    
    public void delete(Long id) {
        userRepository.deleteById(id);
    }
}
```

---

## 3. Derived Query Methods (Property Expressions)

### What are Derived Queries?

Spring Data JPA generates queries from method names automatically.

### Naming Convention

```
findBy[Property][Operator][And/Or][Property][Operator]...
```

### Simple Queries

```java
@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    
    // Find by single property
    Optional<User> findByEmail(String email);
    // SQL: SELECT * FROM users WHERE email = ?
    
    // Find by multiple properties (AND)
    Optional<User> findByFirstNameAndLastName(String firstName, String lastName);
    // SQL: SELECT * FROM users WHERE first_name = ? AND last_name = ?
    
    // Find by multiple properties (OR)
    List<User> findByFirstNameOrLastName(String firstName, String lastName);
    // SQL: SELECT * FROM users WHERE first_name = ? OR last_name = ?
    
    // Return types
    User findByUsername(String username);           // Single result (throws if >1)
    Optional<User> findOptionalByUsername(String username);  // Optional
    List<User> findAllByActive(boolean active);     // Multiple results
}
```

### Operators

| Operator | Example | Generated SQL |
|----------|---------|---------------|
| Is, Equals | findByFirstName | WHERE first_name = ? |
| Not | findByAgeNot | WHERE age <> ? |
| Between | findByAgeBetween | WHERE age BETWEEN ? AND ? |
| LessThan | findByAgeLessThan | WHERE age < ? |
| LessThanEqual | findByAgeLessThanEqual | WHERE age <= ? |
| GreaterThan | findByAgeGreaterThan | WHERE age > ? |
| GreaterThanEqual | findByAgeGreaterThanEqual | WHERE age >= ? |
| IsNull | findByDeletedAtIsNull | WHERE deleted_at IS NULL |
| IsNotNull | findByDeletedAtIsNotNull | WHERE deleted_at IS NOT NULL |
| Like | findByFirstNameLike | WHERE first_name LIKE ? |
| NotLike | findByFirstNameNotLike | WHERE first_name NOT LIKE ? |
| StartingWith | findByFirstNameStartingWith | WHERE first_name LIKE ?% |
| EndingWith | findByFirstNameEndingWith | WHERE first_name LIKE %? |
| Containing | findByFirstNameContaining | WHERE first_name LIKE %?% |
| In | findByAgeIn | WHERE age IN (?, ?, ...) |
| NotIn | findByAgeNotIn | WHERE age NOT IN (?, ?, ...) |
| True | findByActiveTrue | WHERE active = true |
| False | findByActiveFalse | WHERE active = false |
| OrderBy | findByActiveOrderByCreatedAtDesc | ORDER BY created_at DESC |

### Complex Examples

```java
@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    
    // Nested property (User.address.city)
    List<User> findByAddressCity(String city);
    
    // In clause with list
    List<User> findByIdIn(List<Long> ids);
    
    // Limiting results
    User findFirstByOrderByCreatedAtDesc();  // Most recent user
    List<User> findTop10ByOrderByCreatedAtDesc();  // 10 most recent
    
    // Count
    long countByActive(boolean active);
    
    // Exists
    boolean existsByEmail(String email);
    
    // Delete
    void deleteByEmail(String email);
    
    // Distinct
    List<User> findDistinctByFirstName(String firstName);
    
    // Combining everything
    List<User> findByActiveTrueAndAgeBetweenAndAddressCityInOrderByLastNameAsc(
        int minAge, int maxAge, List<String> cities);
}
```

---

## 4. @Query Annotation

### Custom JPQL Queries

```java
@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    
    // Basic JPQL
    @Query("SELECT u FROM User u WHERE u.email = :email")
    Optional<User> findByEmailJpql(@Param("email") String email);
    
    // With JOIN
    @Query("SELECT u FROM User u LEFT JOIN FETCH u.orders WHERE u.id = :id")
    Optional<User> findByIdWithOrders(@Param("id") Long id);
    
    // Projection (DTO)
    @Query("SELECT new com.example.dto.UserSummary(u.id, u.firstName, u.email) FROM User u")
    List<UserSummary> findAllSummaries();
    
    // Aggregate
    @Query("SELECT COUNT(u) FROM User u WHERE u.createdAt >= :date")
    long countUsersCreatedAfter(@Param("date") LocalDateTime date);
    
    // Positional parameters
    @Query("SELECT u FROM User u WHERE u.firstName = ?1 AND u.lastName = ?2")
    List<User> findByFullName(String firstName, String lastName);
}
```

### Native SQL Queries

```java
@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    
    @Query(value = "SELECT * FROM users WHERE email = ?1", nativeQuery = true)
    Optional<User> findByEmailNative(String email);
    
    @Query(value = "SELECT * FROM users ORDER BY created_at DESC LIMIT ?1", 
           nativeQuery = true)
    List<User> findRecentUsers(int limit);
}
```

### Modifying Queries

```java
@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    
    @Modifying
    @Transactional
    @Query("UPDATE User u SET u.active = false WHERE u.lastLogin < :date")
    int deactivateInactiveUsers(@Param("date") LocalDateTime date);
    
    @Modifying
    @Transactional
    @Query("DELETE FROM User u WHERE u.active = false")
    int deleteInactiveUsers();
}
```

---

## 5. Pagination and Sorting

### Pageable Interface

```java
@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    
    Page<User> findByActive(boolean active, Pageable pageable);
    
    Slice<User> findByFirstNameContaining(String name, Pageable pageable);
    
    List<User> findByLastName(String lastName, Sort sort);
}
```

### Usage

```java
@Service
public class UserService {
    
    public Page<User> findActiveUsers(int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("lastName").ascending());
        return userRepository.findByActive(true, pageable);
    }
    
    public Page<User> findUsersWithComplexSort(int page, int size) {
        Sort sort = Sort.by(
            Sort.Order.desc("createdAt"),
            Sort.Order.asc("lastName")
        );
        Pageable pageable = PageRequest.of(page, size, sort);
        return userRepository.findAll(pageable);
    }
}
```

### Page Interface

```java
Page<User> page = userRepository.findAll(PageRequest.of(0, 10));

List<User> content = page.getContent();        // Current page data
int totalPages = page.getTotalPages();         // Total pages
long totalElements = page.getTotalElements();  // Total records
int number = page.getNumber();                 // Current page number
int size = page.getSize();                     // Page size
boolean hasNext = page.hasNext();              // Has more pages
boolean isFirst = page.isFirst();              // Is first page
boolean isLast = page.isLast();                // Is last page
```

### Controller with Pagination

```java
@RestController
@RequestMapping("/api/users")
public class UserController {
    
    @GetMapping
    public Page<User> getUsers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "lastName") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDir) {
        
        Sort sort = sortDir.equalsIgnoreCase("desc") 
            ? Sort.by(sortBy).descending() 
            : Sort.by(sortBy).ascending();
        
        Pageable pageable = PageRequest.of(page, size, sort);
        return userRepository.findAll(pageable);
    }
}
```

---

## 6. Transaction Management

### What is a Transaction?

A **transaction** is a unit of work that is either completely executed or completely rolled back.

### ACID Properties

| Property | Description |
|----------|-------------|
| **A**tomicity | All operations succeed or all fail |
| **C**onsistency | Database moves from one valid state to another |
| **I**solation | Transactions don't interfere with each other |
| **D**urability | Committed changes persist even after system failure |

### @Transactional Annotation

```java
@Service
public class OrderService {
    
    private final OrderRepository orderRepository;
    private final InventoryService inventoryService;
    private final PaymentService paymentService;
    
    @Transactional
    public Order createOrder(OrderRequest request) {
        // All operations in single transaction
        Order order = new Order();
        order.setItems(request.getItems());
        
        // Update inventory
        for (OrderItem item : request.getItems()) {
            inventoryService.reduceStock(item.getProductId(), item.getQuantity());
        }
        
        // Process payment
        paymentService.processPayment(request.getPaymentInfo());
        
        // Save order
        return orderRepository.save(order);
        
        // If any operation fails, ALL changes are rolled back
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
    rollbackFor = {BusinessException.class},
    noRollbackFor = {WarningException.class}
)
public void performTransaction() {
    // ...
}
```

| Attribute | Description |
|-----------|-------------|
| `propagation` | How to handle existing transactions |
| `isolation` | Transaction isolation level |
| `timeout` | Seconds before automatic rollback |
| `readOnly` | Optimization hint for read-only operations |
| `rollbackFor` | Exceptions that trigger rollback |
| `noRollbackFor` | Exceptions that don't trigger rollback |

---

## 7. Transaction Propagation Strategies

### Propagation Types

```java
public enum Propagation {
    REQUIRED,       // Use current or create new (default)
    REQUIRES_NEW,   // Always create new
    MANDATORY,      // Must have existing transaction
    SUPPORTS,       // Use current if exists, otherwise none
    NOT_SUPPORTED,  // Suspend current, run without
    NEVER,          // Must NOT have transaction
    NESTED          // Nested transaction (savepoint)
}
```

### REQUIRED (Default)

```java
@Transactional(propagation = Propagation.REQUIRED)
public void methodA() {
    // Uses existing transaction or creates new
    methodB();  // Same transaction
}

@Transactional(propagation = Propagation.REQUIRED)
public void methodB() {
    // Uses methodA's transaction
}
```

### REQUIRES_NEW

```java
@Transactional
public void processOrder(Order order) {
    orderRepository.save(order);
    
    try {
        auditService.logOrder(order);  // Independent transaction
    } catch (Exception e) {
        // Audit failure doesn't affect order
    }
}

@Service
public class AuditService {
    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void logOrder(Order order) {
        // New transaction, separate from caller
        // If this fails, main transaction is unaffected
    }
}
```

### MANDATORY

```java
@Transactional(propagation = Propagation.MANDATORY)
public void updateInventory() {
    // Throws exception if called without existing transaction
    // Forces callers to manage transaction
}
```

### Propagation Flow Example

```
┌─────────────────────────────────────────────────────────┐
│ @Transactional                                          │
│ public void checkout() {                                │
│   ┌─────────────────────────────────────────────────┐  │
│   │ REQUIRED: orderService.createOrder()            │  │
│   │   - Uses same transaction                        │  │
│   └─────────────────────────────────────────────────┘  │
│                                                         │
│   ┌─────────────────────────────────────────────────┐  │
│   │ REQUIRES_NEW: auditService.log()                │  │
│   │   - New independent transaction                  │  │
│   └─────────────────────────────────────────────────┘  │
│                                                         │
│   ┌─────────────────────────────────────────────────┐  │
│   │ REQUIRED: emailService.sendConfirmation()       │  │
│   │   - Same transaction as checkout                 │  │
│   └─────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

---

## 8. Transaction Isolation Levels

### Isolation Problems

| Problem | Description |
|---------|-------------|
| **Dirty Read** | Reading uncommitted changes from another transaction |
| **Non-Repeatable Read** | Same query returns different results within transaction |
| **Phantom Read** | New rows appear between reads within transaction |

### Isolation Levels

| Level | Dirty Read | Non-Repeatable | Phantom |
|-------|------------|----------------|---------|
| READ_UNCOMMITTED | Possible | Possible | Possible |
| READ_COMMITTED | Prevented | Possible | Possible |
| REPEATABLE_READ | Prevented | Prevented | Possible |
| SERIALIZABLE | Prevented | Prevented | Prevented |

```java
@Transactional(isolation = Isolation.READ_COMMITTED)
public void readData() {
    // Default for most databases
}

@Transactional(isolation = Isolation.SERIALIZABLE)
public void criticalOperation() {
    // Highest isolation, lowest concurrency
}
```

---

## 9. ResponseEntity with Transactions

### Complete Controller-Service Example

```java
@RestController
@RequestMapping("/api/orders")
public class OrderController {
    
    private final OrderService orderService;
    
    @PostMapping
    public ResponseEntity<OrderResponse> createOrder(
            @Valid @RequestBody OrderRequest request) {
        try {
            Order order = orderService.createOrder(request);
            
            URI location = ServletUriComponentsBuilder
                .fromCurrentRequest()
                .path("/{id}")
                .buildAndExpand(order.getId())
                .toUri();
            
            return ResponseEntity.created(location)
                .body(OrderResponse.from(order));
                
        } catch (InsufficientStockException e) {
            return ResponseEntity.badRequest()
                .body(OrderResponse.error("INSUFFICIENT_STOCK", e.getMessage()));
        } catch (PaymentFailedException e) {
            return ResponseEntity.status(HttpStatus.PAYMENT_REQUIRED)
                .body(OrderResponse.error("PAYMENT_FAILED", e.getMessage()));
        }
    }
}

@Service
public class OrderService {
    
    @Transactional
    public Order createOrder(OrderRequest request) {
        // Validate stock
        for (OrderItem item : request.getItems()) {
            if (!inventoryService.hasStock(item.getProductId(), item.getQuantity())) {
                throw new InsufficientStockException(item.getProductId());
            }
        }
        
        // Create order
        Order order = new Order();
        order.setUser(userService.getCurrentUser());
        order.setItems(request.getItems());
        order.setTotal(calculateTotal(request.getItems()));
        
        // Reserve inventory
        for (OrderItem item : request.getItems()) {
            inventoryService.reserve(item.getProductId(), item.getQuantity());
        }
        
        // Process payment (might throw PaymentFailedException)
        paymentService.charge(order.getTotal());
        
        // If everything succeeds, save and return
        return orderRepository.save(order);
    }
}
```

---

## 10. Auditing

### Enable Auditing

```java
@Configuration
@EnableJpaAuditing
public class JpaConfig {
    
    @Bean
    public AuditorAware<String> auditorProvider() {
        return () -> Optional.ofNullable(SecurityContextHolder.getContext())
            .map(ctx -> ctx.getAuthentication())
            .map(auth -> auth.getName());
    }
}
```

### Auditable Entity

```java
@Entity
@EntityListeners(AuditingEntityListener.class)
public class User {
    @Id
    @GeneratedValue
    private Long id;
    
    // Other fields...
    
    @CreatedDate
    @Column(updatable = false)
    private LocalDateTime createdAt;
    
    @LastModifiedDate
    private LocalDateTime updatedAt;
    
    @CreatedBy
    @Column(updatable = false)
    private String createdBy;
    
    @LastModifiedBy
    private String updatedBy;
}
```

### Base Audit Entity

```java
@MappedSuperclass
@EntityListeners(AuditingEntityListener.class)
public abstract class AuditableEntity {
    
    @CreatedDate
    @Column(updatable = false)
    private LocalDateTime createdAt;
    
    @LastModifiedDate
    private LocalDateTime updatedAt;
    
    @CreatedBy
    @Column(updatable = false)
    private String createdBy;
    
    @LastModifiedBy
    private String updatedBy;
    
    // Getters
}

// Usage
@Entity
public class Product extends AuditableEntity {
    // Product fields
}
```

---

## 11. Testing Repositories

### @DataJpaTest

```java
@DataJpaTest
class UserRepositoryTest {
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private TestEntityManager entityManager;
    
    @Test
    void findByEmail_ReturnsUser() {
        // Arrange
        User user = new User("John", "Doe", "john@example.com");
        entityManager.persist(user);
        entityManager.flush();
        
        // Act
        Optional<User> found = userRepository.findByEmail("john@example.com");
        
        // Assert
        assertThat(found).isPresent();
        assertThat(found.get().getFirstName()).isEqualTo("John");
    }
    
    @Test
    void findByEmail_ReturnsEmpty_WhenNotFound() {
        Optional<User> found = userRepository.findByEmail("nonexistent@example.com");
        
        assertThat(found).isEmpty();
    }
    
    @Test
    void save_PersistsUser() {
        User user = new User("Jane", "Doe", "jane@example.com");
        
        User saved = userRepository.save(user);
        
        assertThat(saved.getId()).isNotNull();
        assertThat(entityManager.find(User.class, saved.getId())).isEqualTo(saved);
    }
}
```

---

## Summary

Key concepts covered this week:

| Day | Topics |
|-----|--------|
| **Monday** | Spring Intro, DI, IoC, Beans, Lifecycle, Scopes |
| **Tuesday** | Annotations, Component Scanning, Spring Boot, Actuator |
| **Wednesday** | Spring MVC, Controllers, REST, Validation, Swagger |
| **Thursday** | Hibernate, ORM, HQL, JPQL, Criteria API, Caching |
| **Friday** | Spring Data JPA, Repositories, Queries, Transactions |

### Spring Data JPA Key Points

| Topic | Key Points |
|-------|------------|
| **Repositories** | JpaRepository > CrudRepository for full features |
| **Derived Queries** | Method names generate SQL automatically |
| **@Query** | Custom JPQL/SQL when needed |
| **Pagination** | PageRequest, Page, Sort |
| **Transactions** | @Transactional for ACID compliance |
| **Propagation** | REQUIRED (default), REQUIRES_NEW, MANDATORY |
| **Isolation** | READ_COMMITTED (typical), SERIALIZABLE (strictest) |

**Next Week**: Spring Data advanced topics, AOP, Security, Kafka, and Microservices!
