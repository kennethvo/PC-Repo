# Week 7 - Monday: Spring Data JPA and Week Overview

## Week 7 Overview
This week focuses on **Spring Data JPA, Event-Driven Architecture, and Microservices**:
-   **Spring Data JPA**: Simplifying data access with repositories and transactions
-   **Spring AOP**: Aspect-Oriented Programming for cross-cutting concerns
-   **Spring Security**: Authentication and authorization
-   **Apache Kafka**: Event streaming and message-driven architecture
-   **Microservices Architecture**: Building distributed systems

---

## 1. Spring Data Overview
**Spring Data** is a high-level Spring project whose purpose is to unify and simplify access to different kinds of data stores, both relational and NoSQL.

### The Problem it Solves
-   **Boilerplate reduction**: Removes the need to write repetitive CRUD (Create, Read, Update, Delete) logic.
-   **Unified API**: Provides a consistent programming model regardless of the underlying data store (JPA, MongoDB, Redis, etc.).
-   **Productivity**: Developers can focus on business logic rather than data access code.

### Architecture
Spring Data sits **on top** of existing data access technologies (like JDBC, JPA, or MongoDB drivers). It does NOT replace them; it abstracts them.

```
┌─────────────────────────────────┐
│   Your Application (Service)    │
├─────────────────────────────────┤
│    Spring Data JPA (Repository) │ ← Auto-generated implementations
├─────────────────────────────────┤
│         JPA (Specification)     │ ← Interface/Contract
├─────────────────────────────────┤
│      Hibernate (Provider)       │ ← Implementation
├─────────────────────────────────┤
│      JDBC (Driver)              │
├─────────────────────────────────┤
│      Database (PostgreSQL)      │
└─────────────────────────────────┘
```

---

## 2. Relationship Between JPA, Hibernate, and Spring Data JPA

It is crucial to understand the distinction between these three layers.

| Technology | Role | Description |
| :--- | :--- | :--- |
| **JPA** (Java Persistence API) | **The Standard (Interface)** | A specification (set of interfaces) that defines *how* Java objects should be mapped to databases. It is NOT code; it is a document/contract. Part of Jakarta EE. |
| **Hibernate** | **The Implementation (Provider)** | A library that *implements* the JPA specification. It does the actual work of generating SQL and managing connections. The most popular JPA provider. |
| **Spring Data JPA** | **The Abstraction (Framework)** | A framework that sits on top of JPA to provide extra features like automatic repository generation. It uses Hibernate (or any JPA provider) under the hood. |

### Analogy
-   **JPA**: The "USB Standard" (Blueprint/Specification).
-   **Hibernate**: A "Samsung USB Drive" (Actual Implementation).
-   **Spring Data JPA**: The "Operating System File Manager" (Tool that makes using the drive easy).

### Why Use All Three?
-   **JPA**: Ensures vendor independence. You can switch from Hibernate to EclipseLink without changing code.
-   **Hibernate**: Provides robust ORM capabilities with excellent performance.
-   **Spring Data JPA**: Eliminates boilerplate code and provides advanced features.

---

## 3. Spring Data Repositories

The core concept of Spring Data is the **Repository**. It is an interface that you define, and Spring automatically generates the implementation at runtime using proxies.

### Repository Hierarchy

```
Repository<T, ID>                    (Marker Interface)
    │
    ├── CrudRepository<T, ID>        (Basic CRUD)
    │       ├── save(S entity)
    │       ├── findById(ID id)
    │       ├── findAll()
    │       ├── delete(T entity)
    │       └── count()
    │
    ├── PagingAndSortingRepository<T, ID>  (Pagination + Sorting)
    │       ├── findAll(Sort sort)
    │       └── findAll(Pageable pageable)
    │
    └── JpaRepository<T, ID>         (JPA-specific features)
            ├── flush()
            ├── saveAndFlush()
            ├── deleteAllInBatch()
            └── getById(ID id)  // Returns proxy
```

### JpaRepository vs CrudRepository

| Feature | CrudRepository | JpaRepository |
| :--- | :--- | :--- |
| **Basic CRUD** | ✅ Yes | ✅ Yes |
| **Pagination/Sorting** | ❌ No | ✅ Yes (inherits from PagingAndSortingRepository) |
| **Batch Operations** | ❌ No | ✅ Yes (`deleteAllInBatch`, `saveAllAndFlush`) |
| **Flush Control** | ❌ No | ✅ Yes (`flush`, `saveAndFlush`) |
| **Use Case** | Technology-agnostic repositories | JPA-specific repositories with advanced features |

**Recommendation**:
-   **Use `CrudRepository`** if you only need standard CRUD and want to keep your repository agnostic of the persistence technology (cleaner architecture).
-   **Use `JpaRepository`** if you need JPA-specific features like flushing changes instantly to the DB or batch deletes.

### Example Repository
```java
@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    // Spring Data JPA automatically generates implementations:
    // - save(User user)
    // - findById(Long id)
    // - findAll()
    // - delete(User user)
    // - count()
    // + All JpaRepository-specific methods
}
```

### Using the Repository
```java
@Service
public class UserService {
    
    @Autowired
    private UserRepository userRepo;
    
    public User createUser(User user) {
        return userRepo.save(user);  // INSERT or UPDATE
    }
    
    public Optional<User> getUser(Long id) {
        return userRepo.findById(id);  // SELECT by primary key
    }
    
    public List<User> getAllUsers() {
        return userRepo.findAll();  // SELECT all
    }
    
    public void deleteUser(Long id) {
        userRepo.deleteById(id);  // DELETE by ID
    }
}
```

---

## 4. Property Expressions (Derived Query Methods)

One of the most powerful features of Spring Data is the ability to generate SQL queries derived entirely from the **method name**. This is called **Query Derivation**.

### How It Works
Spring Data parses the method name and generates a JPQL query at runtime.

### Syntax Rules

#### Prefixes
-   `find...By` / `read...By` / `get...By` / `query...By`: Return entities
-   `count...By`: Return count
-   `exists...By`: Return boolean
-   `delete...By` / `remove...By`: Delete entities

#### Property Navigation
-   Use camelCase property names from your entity.
-   Concatenate with `And`, `Or`.

#### Operators
| Keyword | Example | JPQL Fragment |
| :--- | :--- | :--- |
| `And` | `findByFirstNameAndLastName` | `WHERE firstName = ?1 AND lastName = ?2` |
| `Or` | `findByFirstNameOrLastName` | `WHERE firstName = ?1 OR lastName = ?2` |
| `Between` | `findByAgeBetween` | `WHERE age BETWEEN ?1 AND ?2` |
| `LessThan` | `findByAgeLessThan` | `WHERE age < ?1` |
| `LessThanEqual` | `findByAgeLessThanEqual` | `WHERE age <= ?1` |
| `GreaterThan` | `findByAgeGreaterThan` | `WHERE age > ?1` |
| `GreaterThanEqual` | `findByAgeGreaterThanEqual` | `WHERE age >= ?1` |
| `After` | `findByStartDateAfter` | `WHERE startDate > ?1` |
| `Before` | `findByStartDateBefore` | `WHERE startDate < ?1` |
| `IsNull` / `Null` | `findByAgeIsNull` | `WHERE age IS NULL` |
| `IsNotNull` / `NotNull` | `findByAgeIsNotNull` | `WHERE age IS NOT NULL` |
| `Like` | `findByFirstNameLike` | `WHERE firstName LIKE ?1` |
| `NotLike` | `findByFirstNameNotLike` | `WHERE firstName NOT LIKE ?1` |
| `StartingWith` | `findByFirstNameStartingWith` | `WHERE firstName LIKE ?1%` |
| `EndingWith` | `findByFirstNameEndingWith` | `WHERE firstName LIKE %?1` |
| `Containing` | `findByFirstNameContaining` | `WHERE firstName LIKE %?1%` |
| `OrderBy` | `findByAgeOrderByLastNameAsc` | `ORDER BY lastName ASC` |
| `Not` | `findByAgeNot` | `WHERE age <> ?1` |
| `In` | `findByAgeIn(Collection<Integer>)` | `WHERE age IN (?1, ?2, ...)` |
| `NotIn` | `findByAgeNotIn(Collection<Integer>)` | `WHERE age NOT IN (?1, ?2, ...)` |
| `True` | `findByActiveTrue` | `WHERE active = true` |
| `False` | `findByActiveFalse` | `WHERE active = false` |
| `IgnoreCase` | `findByFirstNameIgnoreCase` | `WHERE UPPER(firstName) = UPPER(?1)` |

### Examples

Assuming a `User` entity with fields: `firstName`, `lastName`, `age`, `email`, `active`, `createdDate`

```java
@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    
    // Simple property match
    List<User> findByFirstName(String firstName);
    // JPQL: SELECT u FROM User u WHERE u.firstName = ?1
    
    // Multiple conditions with AND
    List<User> findByFirstNameAndLastName(String first, String last);
    // JPQL: SELECT u FROM User u WHERE u.firstName = ?1 AND u.lastName = ?2
    
    // Multiple conditions with OR
    List<User> findByFirstNameOrLastName(String first, String last);
    // JPQL: SELECT u FROM User u WHERE u.firstName = ?1 OR u.lastName = ?2
    
    // Comparison operators
    List<User> findByAgeGreaterThan(Integer age);
    // JPQL: SELECT u FROM User u WHERE u.age > ?1
    
    List<User> findByAgeLessThanEqual(Integer age);
    // JPQL: SELECT u FROM User u WHERE u.age <= ?1
    
    // Range queries
    List<User> findByAgeBetween(Integer minAge, Integer maxAge);
    // JPQL: SELECT u FROM User u WHERE u.age BETWEEN ?1 AND ?2
    
    List<User> findByCreatedDateAfter(LocalDate date);
    // JPQL: SELECT u FROM User u WHERE u.createdDate > ?1
    
    // String matching
    List<User> findByFirstNameLike(String pattern);
    // Usage: findByFirstNameLike("%John%")
    // JPQL: SELECT u FROM User u WHERE u.firstName LIKE ?1
    
    List<User> findByFirstNameStartingWith(String prefix);
    // Usage: findByFirstNameStartingWith("Jo")
    // JPQL: SELECT u FROM User u WHERE u.firstName LIKE ?1%
    
    List<User> findByEmailContaining(String substring);
    // JPQL: SELECT u FROM User u WHERE u.email LIKE %?1%
    
    // Boolean properties
    List<User> findByActiveTrue();
    // JPQL: SELECT u FROM User u WHERE u.active = true
    
    List<User> findByActiveFalse();
    // JPQL: SELECT u FROM User u WHERE u.active = false
    
    // Null checks
    List<User> findByEmailIsNull();
    // JPQL: SELECT u FROM User u WHERE u.email IS NULL
    
    List<User> findByEmailIsNotNull();
    // JPQL: SELECT u FROM User u WHERE u.email IS NOT NULL
    
    // Collection membership
    List<User> findByAgeIn(Collection<Integer> ages);
    // JPQL: SELECT u FROM User u WHERE u.age IN (?1, ?2, ...)
    
    // Sorting
    List<User> findByLastNameOrderByFirstNameAsc(String lastName);
    // JPQL: SELECT u FROM User u WHERE u.lastName = ?1 ORDER BY u.firstName ASC
    
    List<User> findByAgeGreaterThanOrderByLastNameDescFirstNameAsc(Integer age);
    // JPQL: SELECT u FROM User u WHERE u.age > ?1 ORDER BY u.lastName DESC, u.firstName ASC
    
    // Case insensitive
    List<User> findByFirstNameIgnoreCase(String firstName);
    // JPQL: SELECT u FROM User u WHERE UPPER(u.firstName) = UPPER(?1)
    
    // Count queries
    long countByLastName(String lastName);
    // JPQL: SELECT COUNT(u) FROM User u WHERE u.lastName = ?1
    
    // Existence checks
    boolean existsByEmail(String email);
    // JPQL: SELECT CASE WHEN COUNT(u) > 0 THEN true ELSE false END FROM User u WHERE u.email = ?1
    
    // Delete queries
    void deleteByAge(Integer age);
    // JPQL: DELETE FROM User u WHERE u.age = ?1
    
    // Limiting results
    User findFirstByOrderByCreatedDateDesc();
    // JPQL: SELECT u FROM User u ORDER BY u.createdDate DESC LIMIT 1
    
    List<User> findTop10ByOrderByAgeDesc();
    // JPQL: SELECT u FROM User u ORDER BY u.age DESC LIMIT 10
}
```

### Pagination and Sorting

```java
// Using Pageable
Page<User> findByLastName(String lastName, Pageable pageable);

// Usage in Service
Pageable pageable = PageRequest.of(0, 10, Sort.by("firstName").ascending());
Page<User> page = userRepo.findByLastName("Smith", pageable);

// Using Sort
List<User> findByLastName(String lastName, Sort sort);

// Usage
Sort sort = Sort.by("firstName").ascending().and(Sort.by("age").descending());
List<User> users = userRepo.findByLastName("Smith", sort);
```

---

## 5. @Query Annotation

When derived queries become too complex or you need specific SQL, use `@Query`.

### JPQL Queries
```java
@Query("SELECT u FROM User u WHERE u.email = ?1")
User findByEmailAddress(String email);

@Query("SELECT u FROM User u WHERE u.firstName = :firstName AND u.lastName = :lastName")
User findByFullName(@Param("firstName") String first, @Param("lastName") String last);

// Complex JPQL
@Query("SELECT u FROM User u WHERE u.age > :age AND u.active = true ORDER BY u.lastName")
List<User> findActiveUsersOlderThan(@Param("age") Integer age);
```

### Native SQL Queries
```java
@Query(value = "SELECT * FROM users WHERE email_address = ?1", nativeQuery = true)
User findByEmailNative(String email);

@Query(value = "SELECT * FROM users WHERE age > :age LIMIT :limit", nativeQuery = true)
List<User> findTopNUsersByAge(@Param("age") Integer age, @Param("limit") Integer limit);
```

### Modifying Queries
```java
@Modifying
@Transactional
@Query("UPDATE User u SET u.active = false WHERE u.lastLogin < :date")
int deactivateInactiveUsers(@Param("date") LocalDate date);

@Modifying
@Query("DELETE FROM User u WHERE u.age < :age")
void deleteUsersYoungerThan(@Param("age") Integer age);
```

---

## 6. @RequestMapping & @ResponseBody (Spring MVC Review)

While not strictly Spring Data JPA, these are essential for building REST APIs with Spring Data repositories.

### @RequestMapping
Maps HTTP requests to handler methods.

```java
@RestController
@RequestMapping("/api/users")
public class UserController {
    
    @Autowired
    private UserService userService;
    
    // GET /api/users
    @GetMapping
    public List<User> getAllUsers() {
        return userService.getAllUsers();
    }
    
    // GET /api/users/123
    @GetMapping("/{id}")
    public User getUser(@PathVariable Long id) {
        return userService.getUser(id)
                .orElseThrow(() -> new UserNotFoundException(id));
    }
    
    // POST /api/users
    @PostMapping
    public User createUser(@RequestBody User user) {
        return userService.createUser(user);
    }
    
    // PUT /api/users/123
    @PutMapping("/{id}")
    public User updateUser(@PathVariable Long id, @RequestBody User user) {
        return userService.updateUser(id, user);
    }
    
    // DELETE /api/users/123
    @DeleteMapping("/{id}")
    public void deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
    }
}
```

### @ResponseBody
The `@ResponseBody` annotation tells Spring to serialize the return value into JSON (using Jackson) and write it directly to the HTTP response body.

**Note**: `@RestController` = `@Controller` + `@ResponseBody` (applied to all methods)

---

## 7. Advanced Repository Features

### Custom Query Methods with Specifications
```java
public interface UserRepository extends JpaRepository<User, Long>, JpaSpecificationExecutor<User> {
}

// Usage with dynamic queries
Specification<User> spec = (root, query, cb) -> {
    List<Predicate> predicates = new ArrayList<>();
    if (firstName != null) {
        predicates.add(cb.equal(root.get("firstName"), firstName));
    }
    if (minAge != null) {
        predicates.add(cb.greaterThan(root.get("age"), minAge));
    }
    return cb.and(predicates.toArray(new Predicate[0]));
};

List<User> users = userRepo.findAll(spec);
```

### Projections
Return only specific fields instead of entire entities.

```java
// Interface-based projection
public interface UserSummary {
    String getFirstName();
    String getLastName();
    String getEmail();
}

List<UserSummary> findByLastName(String lastName);

// Class-based projection (DTO)
public class UserDTO {
    private String firstName;
    private String email;
    
    public UserDTO(String firstName, String email) {
        this.firstName = firstName;
        this.email = email;
    }
}

@Query("SELECT new com.example.dto.UserDTO(u.firstName, u.email) FROM User u WHERE u.active = true")
List<UserDTO> findActiveUserSummaries();
```

---

## 8. Best Practices

### Repository Design
1.  **Keep repositories focused**: One repository per entity.
2.  **Use derived queries for simple cases**: Only use `@Query` when necessary.
3.  **Avoid business logic in repositories**: Repositories should only handle data access.
4.  **Use pagination for large datasets**: Don't return thousands of records at once.

### Performance
1.  **Use projections**: Don't fetch all fields if you only need a few.
2.  **Batch operations**: Use `saveAll()` instead of multiple `save()` calls.
3.  **Fetch strategy**: Use `@EntityGraph` to avoid N+1 query problems.
4.  **Indexing**: Ensure database columns used in queries are indexed.

### Query Naming
1.  **Be explicit**: `findByEmailIgnoreCase` is better than `findByEmail` if case doesn't matter.
2.  **Limit length**: If method name gets too long, use `@Query`.
3.  **Document complex queries**: Add comments for non-obvious queries.
