# Week 6 - Thursday: Hibernate & Object-Relational Mapping

## 1. Object-Relational Mapping (ORM)

### What is ORM?

**Object-Relational Mapping (ORM)** is a technique that maps objects to relational database tables.

### The Impedance Mismatch Problem

| Java (Objects) | SQL (Tables) | Mismatch |
|----------------|--------------|----------|
| Classes | Tables | Structure |
| Objects | Rows | Instances |
| Fields | Columns | Attributes |
| References | Foreign Keys | Relationships |
| Inheritance | No concept | Hierarchy |
| Identity (==) | Primary Key | Equality |

### Class vs Schema

**Java Class**:
```java
public class User {
    private Long id;
    private String firstName;
    private String lastName;
    private String email;
    private Address address;  // Object reference
    private List<Order> orders;  // Collection
}
```

**Database Schema**:
```sql
CREATE TABLE users (
    id BIGINT PRIMARY KEY,
    first_name VARCHAR(50),
    last_name VARCHAR(50),
    email VARCHAR(100),
    address_id BIGINT REFERENCES addresses(id)  -- Foreign key
);

CREATE TABLE orders (
    id BIGINT PRIMARY KEY,
    user_id BIGINT REFERENCES users(id),  -- Foreign key
    -- order fields
);
```

**ORM bridges this gap automatically!**

---

## 2. Spring Data ORM Providers

### JPA Providers

| Provider | Description |
|----------|-------------|
| **Hibernate** | Most popular, feature-rich |
| **EclipseLink** | Reference implementation |
| **OpenJPA** | Apache implementation |

### JPA vs Hibernate vs Spring Data JPA

```
┌─────────────────────────────────────────────────────────┐
│                   Your Application                      │
├─────────────────────────────────────────────────────────┤
│              Spring Data JPA                            │
│         (Repository abstraction layer)                  │
├─────────────────────────────────────────────────────────┤
│           JPA (Java Persistence API)                    │
│             (Standard specification)                    │
├─────────────────────────────────────────────────────────┤
│        Hibernate (or EclipseLink, etc.)                │
│             (JPA implementation)                         │
├─────────────────────────────────────────────────────────┤
│                  JDBC                                   │
│          (Database connectivity)                        │
├─────────────────────────────────────────────────────────┤
│               Database                                  │
│        (PostgreSQL, MySQL, H2, etc.)                   │
└─────────────────────────────────────────────────────────┘
```

| Layer | Role |
|-------|------|
| **Spring Data JPA** | Repositories, query methods, pagination |
| **JPA** | Standard API (EntityManager, annotations) |
| **Hibernate** | Actual implementation (Session, caching) |
| **JDBC** | Low-level database connectivity |

---

## 3. Hibernate Architecture

### Core Components

```
┌──────────────────────────────────────────────────────────┐
│                    Application                           │
│                         │                                │
│                         ▼                                │
│  ┌──────────────────────────────────────────────────┐  │
│  │             SessionFactory                        │  │
│  │  (Heavy, one per database, thread-safe)          │  │
│  └─────────────────────┬────────────────────────────┘  │
│                        │                                 │
│                        ▼                                 │
│  ┌──────────────────────────────────────────────────┐  │
│  │                  Session                          │  │
│  │  (Light, one per request, NOT thread-safe)       │  │
│  │  (Wraps JDBC connection)                         │  │
│  └─────────────────────┬────────────────────────────┘  │
│                        │                                 │
│                        ▼                                 │
│  ┌──────────────────────────────────────────────────┐  │
│  │               Transaction                         │  │
│  │  (Unit of work, ACID guarantees)                 │  │
│  └──────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────┘
```

### SessionFactory

The **SessionFactory** is a thread-safe, immutable cache of compiled mappings.

- Created once at application startup
- Expensive to create
- Produces Session objects
- In Spring: Managed automatically

### Session (EntityManager in JPA)

The **Session** is the main runtime interface between Java and Hibernate.

```java
// Hibernate Session API
Session session = sessionFactory.openSession();
try {
    Transaction tx = session.beginTransaction();
    
    User user = new User("John", "Doe");
    session.save(user);  // Hibernate-specific
    
    tx.commit();
} finally {
    session.close();
}

// JPA EntityManager API (preferred)
EntityManager em = entityManagerFactory.createEntityManager();
try {
    em.getTransaction().begin();
    
    User user = new User("John", "Doe");
    em.persist(user);  // JPA standard
    
    em.getTransaction().commit();
} finally {
    em.close();
}
```

---

## 4. Entity Annotations for Model Classes

### Basic Entity

```java
import jakarta.persistence.*;  // JPA 3.0 (Spring Boot 3+)
// import javax.persistence.*;  // JPA 2.x (Spring Boot 2.x)

@Entity
@Table(name = "users")
public class User {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "first_name", nullable = false, length = 50)
    private String firstName;
    
    @Column(name = "last_name", nullable = false, length = 50)
    private String lastName;
    
    @Column(unique = true, nullable = false)
    private String email;
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    // Constructors, getters, setters
}
```

### Common Annotations

| Annotation | Purpose |
|------------|---------|
| `@Entity` | Marks class as JPA entity |
| `@Table` | Specifies table name/schema |
| `@Id` | Primary key field |
| `@GeneratedValue` | Auto-generation strategy |
| `@Column` | Column customization |
| `@Temporal` | Date/time mapping (pre-Java 8) |
| `@Enumerated` | Enum mapping (STRING/ORDINAL) |
| `@Transient` | Exclude from persistence |
| `@Lob` | Large objects (BLOB/CLOB) |

### Generation Strategies

| Strategy | Description | Database |
|----------|-------------|----------|
| `IDENTITY` | Auto-increment | MySQL, PostgreSQL |
| `SEQUENCE` | Database sequence | PostgreSQL, Oracle |
| `TABLE` | Separate table for IDs | All |
| `AUTO` | Provider chooses | Any |
| `UUID` | UUID generation | Any |

### Relationship Annotations

```java
@Entity
public class Order {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    // Many orders belong to one user
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
    
    // One order has many items
    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<OrderItem> items = new ArrayList<>();
}

@Entity
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    // One user has many orders
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
    private List<Order> orders = new ArrayList<>();
    
    // One user has one address (optional)
    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "address_id")
    private Address address;
}

@Entity
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    // Many products have many categories
    @ManyToMany
    @JoinTable(
        name = "product_categories",
        joinColumns = @JoinColumn(name = "product_id"),
        inverseJoinColumns = @JoinColumn(name = "category_id")
    )
    private Set<Category> categories = new HashSet<>();
}
```

---

## 5. Hibernate Configuration (hibernate.cfg.xml)

### Traditional XML Configuration

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE hibernate-configuration PUBLIC
    "-//Hibernate/Hibernate Configuration DTD 3.0//EN"
    "http://www.hibernate.org/dtd/hibernate-configuration-3.0.dtd">

<hibernate-configuration>
    <session-factory>
        <!-- Database connection settings -->
        <property name="hibernate.connection.driver_class">org.postgresql.Driver</property>
        <property name="hibernate.connection.url">jdbc:postgresql://localhost:5432/mydb</property>
        <property name="hibernate.connection.username">postgres</property>
        <property name="hibernate.connection.password">password</property>
        
        <!-- Dialect (SQL generation strategy) -->
        <property name="hibernate.dialect">org.hibernate.dialect.PostgreSQLDialect</property>
        
        <!-- DDL generation -->
        <property name="hibernate.hbm2ddl.auto">update</property>
        
        <!-- Show SQL in console -->
        <property name="hibernate.show_sql">true</property>
        <property name="hibernate.format_sql">true</property>
        
        <!-- Connection pool -->
        <property name="hibernate.c3p0.min_size">5</property>
        <property name="hibernate.c3p0.max_size">20</property>
        
        <!-- Entity mappings -->
        <mapping class="com.example.entity.User"/>
        <mapping class="com.example.entity.Order"/>
    </session-factory>
</hibernate-configuration>
```

### Spring Boot Configuration (Preferred)

```properties
# application.properties

# Database
spring.datasource.url=jdbc:postgresql://localhost:5432/mydb
spring.datasource.username=postgres
spring.datasource.password=password
spring.datasource.driver-class-name=org.postgresql.Driver

# JPA/Hibernate
spring.jpa.database-platform=org.hibernate.dialect.PostgreSQLDialect
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.format_sql=true

# Connection pool (HikariCP - default in Spring Boot)
spring.datasource.hikari.maximum-pool-size=10
spring.datasource.hikari.minimum-idle=5
```

### DDL Auto Options

| Value | Description | Use Case |
|-------|-------------|----------|
| `none` | No DDL changes | Production |
| `validate` | Validate schema, fail if mismatch | Production |
| `update` | Update schema without data loss | Development |
| `create` | Drop and create on startup | Testing |
| `create-drop` | Create on start, drop on stop | Testing |

---

## 6. Inheritance Hierarchies

### JPA Inheritance Strategies

JPA provides three strategies for mapping class hierarchies to database tables.

#### 1. SINGLE_TABLE (Default)

All classes in hierarchy stored in one table with a discriminator column.

```java
@Entity
@Inheritance(strategy = InheritanceType.SINGLE_TABLE)
@DiscriminatorColumn(name = "payment_type", discriminatorType = DiscriminatorType.STRING)
public abstract class Payment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private BigDecimal amount;
    private LocalDateTime timestamp;
}

@Entity
@DiscriminatorValue("CREDIT_CARD")
public class CreditCardPayment extends Payment {
    private String cardNumber;
    private String expiryDate;
}

@Entity
@DiscriminatorValue("PAYPAL")
public class PayPalPayment extends Payment {
    private String email;
    private String transactionId;
}
```

**Generated Table**:
```sql
CREATE TABLE payment (
    id BIGINT PRIMARY KEY,
    payment_type VARCHAR(31),  -- Discriminator
    amount DECIMAL,
    timestamp TIMESTAMP,
    card_number VARCHAR(255),   -- CreditCardPayment
    expiry_date VARCHAR(255),   -- CreditCardPayment
    email VARCHAR(255),         -- PayPalPayment
    transaction_id VARCHAR(255) -- PayPalPayment
);
```

**Pros**: Best performance (no joins), simple queries
**Cons**: Cannot enforce NOT NULL on subclass columns, wasted space

#### 2. JOINED (Table Per Subclass)

Each class has its own table, joined by foreign key.

```java
@Entity
@Inheritance(strategy = InheritanceType.JOINED)
public abstract class Payment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private BigDecimal amount;
}

@Entity
public class CreditCardPayment extends Payment {
    private String cardNumber;
}

@Entity
public class PayPalPayment extends Payment {
    private String email;
}
```

**Generated Tables**:
```sql
CREATE TABLE payment (
    id BIGINT PRIMARY KEY,
    amount DECIMAL
);

CREATE TABLE credit_card_payment (
    id BIGINT PRIMARY KEY REFERENCES payment(id),
    card_number VARCHAR(255)
);

CREATE TABLE paypal_payment (
    id BIGINT PRIMARY KEY REFERENCES payment(id),
    email VARCHAR(255)
);
```

**Pros**: Normalized, no wasted space, can enforce constraints
**Cons**: Requires JOINs for queries (slower)

#### 3. TABLE_PER_CLASS

Each concrete class has its own complete table.

```java
@Entity
@Inheritance(strategy = InheritanceType.TABLE_PER_CLASS)
public abstract class Payment {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)  // Cannot use IDENTITY
    private Long id;
    private BigDecimal amount;
}

@Entity
public class CreditCardPayment extends Payment {
    private String cardNumber;
}

@Entity
public class PayPalPayment extends Payment {
    private String email;
}
```

**Generated Tables**:
```sql
CREATE TABLE credit_card_payment (
    id BIGINT PRIMARY KEY,
    amount DECIMAL,
    card_number VARCHAR(255)
);

CREATE TABLE paypal_payment (
    id BIGINT PRIMARY KEY,
    amount DECIMAL,
    email VARCHAR(255)
);
```

**Pros**: Each table is independent, no nulls
**Cons**: Polymorphic queries require UNION, ID generation complex

### Strategy Comparison

| Strategy | Tables | Performance | Polymorphic Queries | Data Integrity |
|----------|--------|-------------|---------------------|----------------|
| SINGLE_TABLE | 1 | Fast | Fast | Poor (nullable columns) |
| JOINED | N+1 | Medium | Medium (JOINs) | Good |
| TABLE_PER_CLASS | N | Fast per type | Slow (UNION) | Good |

---

## 7. HQL (Hibernate Query Language)

### What is HQL?

**HQL** is Hibernate's object-oriented query language. It uses class and property names instead of table and column names.

### Basic HQL Syntax

```java
// Get session
Session session = entityManager.unwrap(Session.class);

// Simple query
Query<User> query = session.createQuery(
    "FROM User", User.class);
List<User> users = query.getResultList();

// With WHERE clause (uses property names, not column names)
Query<User> query = session.createQuery(
    "FROM User u WHERE u.firstName = :name", User.class);
query.setParameter("name", "John");
List<User> users = query.getResultList();

// SELECT specific fields
Query<Object[]> query = session.createQuery(
    "SELECT u.firstName, u.email FROM User u", Object[].class);
List<Object[]> results = query.getResultList();

// JOIN
Query<Order> query = session.createQuery(
    "SELECT o FROM Order o JOIN o.user u WHERE u.email = :email", Order.class);
query.setParameter("email", "john@example.com");

// Aggregates
Query<Long> query = session.createQuery(
    "SELECT COUNT(u) FROM User u WHERE u.active = true", Long.class);
Long count = query.getSingleResult();

// UPDATE
Query query = session.createQuery(
    "UPDATE User u SET u.active = false WHERE u.lastLogin < :date");
query.setParameter("date", LocalDateTime.now().minusDays(90));
int updatedCount = query.executeUpdate();

// DELETE
Query query = session.createQuery(
    "DELETE FROM User u WHERE u.active = false");
int deletedCount = query.executeUpdate();
```

---

## 8. JPQL (Java Persistence Query Language)

### What is JPQL?

**JPQL** is the JPA standard query language. Similar to HQL but standardized across all JPA providers.

### JPQL Examples

```java
@Repository
public class UserRepositoryImpl {
    
    @PersistenceContext
    private EntityManager entityManager;
    
    // Basic query
    public List<User> findAllUsers() {
        return entityManager.createQuery(
            "SELECT u FROM User u", User.class)
            .getResultList();
    }
    
    // Parameterized query
    public List<User> findByFirstName(String firstName) {
        return entityManager.createQuery(
            "SELECT u FROM User u WHERE u.firstName = :name", User.class)
            .setParameter("name", firstName)
            .getResultList();
    }
    
    // Positional parameters
    public User findByEmail(String email) {
        return entityManager.createQuery(
            "SELECT u FROM User u WHERE u.email = ?1", User.class)
            .setParameter(1, email)
            .getSingleResult();
    }
    
    // JOIN with condition
    public List<User> findUsersWithOrders() {
        return entityManager.createQuery(
            "SELECT DISTINCT u FROM User u JOIN u.orders o WHERE o.total > :minTotal", 
            User.class)
            .setParameter("minTotal", new BigDecimal("100"))
            .getResultList();
    }
    
    // DTO projection
    public List<UserDTO> findUserDTOs() {
        return entityManager.createQuery(
            "SELECT NEW com.example.dto.UserDTO(u.id, u.firstName, u.email) FROM User u", 
            UserDTO.class)
            .getResultList();
    }
    
    // Pagination
    public List<User> findUsersPaginated(int page, int size) {
        return entityManager.createQuery(
            "SELECT u FROM User u ORDER BY u.createdAt DESC", User.class)
            .setFirstResult(page * size)
            .setMaxResults(size)
            .getResultList();
    }
}
```

### Spring Data JPA @Query

```java
@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    
    // JPQL query
    @Query("SELECT u FROM User u WHERE u.email = :email")
    Optional<User> findByEmailJpql(@Param("email") String email);
    
    // With JOIN
    @Query("SELECT u FROM User u LEFT JOIN FETCH u.orders WHERE u.id = :id")
    Optional<User> findByIdWithOrders(@Param("id") Long id);
    
    // Modifying query
    @Modifying
    @Query("UPDATE User u SET u.active = false WHERE u.lastLogin < :date")
    int deactivateInactiveUsers(@Param("date") LocalDateTime date);
}
```

---

## 9. Native SQL

### When to Use Native SQL

- Complex queries not expressible in JPQL
- Database-specific features
- Performance optimization
- Stored procedures

### Native SQL Examples

```java
@Repository
public class UserRepositoryImpl {
    
    @PersistenceContext
    private EntityManager entityManager;
    
    // Simple native query
    public List<User> findAllNative() {
        return entityManager.createNativeQuery(
            "SELECT * FROM users", User.class)
            .getResultList();
    }
    
    // With parameters
    public List<User> findByEmailNative(String email) {
        return entityManager.createNativeQuery(
            "SELECT * FROM users WHERE email = :email", User.class)
            .setParameter("email", email)
            .getResultList();
    }
    
    // Complex join (database-specific)
    public List<Object[]> findUserOrderStats() {
        return entityManager.createNativeQuery(
            "SELECT u.id, u.first_name, COUNT(o.id) as order_count, SUM(o.total) as total_spent " +
            "FROM users u " +
            "LEFT JOIN orders o ON u.id = o.user_id " +
            "GROUP BY u.id, u.first_name " +
            "ORDER BY total_spent DESC NULLS LAST")  // PostgreSQL-specific
            .getResultList();
    }
}
```

### Spring Data JPA Native Query

```java
@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    
    @Query(value = "SELECT * FROM users WHERE email = ?1", nativeQuery = true)
    User findByEmailNative(String email);
    
    @Query(value = "SELECT * FROM users ORDER BY created_at DESC LIMIT :limit", 
           nativeQuery = true)
    List<User> findRecentUsers(@Param("limit") int limit);
    
    @Modifying
    @Query(value = "DELETE FROM users WHERE last_login < :date", nativeQuery = true)
    int deleteInactiveUsers(@Param("date") LocalDateTime date);
}
```

---

## 10. Criteria API

### What is Criteria API?

The **Criteria API** provides a type-safe, programmatic way to build queries.

### Benefits

- **Type-safe**: Compile-time checking
- **Dynamic**: Build queries based on runtime conditions
- **Refactoring-friendly**: No string queries to break

### Basic Criteria Query

```java
@Repository
public class UserRepositoryImpl {
    
    @PersistenceContext
    private EntityManager entityManager;
    
    public List<User> findAllUsers() {
        CriteriaBuilder cb = entityManager.getCriteriaBuilder();
        CriteriaQuery<User> query = cb.createQuery(User.class);
        Root<User> root = query.from(User.class);
        
        query.select(root);
        
        return entityManager.createQuery(query).getResultList();
    }
    
    public List<User> findByFirstName(String firstName) {
        CriteriaBuilder cb = entityManager.getCriteriaBuilder();
        CriteriaQuery<User> query = cb.createQuery(User.class);
        Root<User> root = query.from(User.class);
        
        query.select(root)
             .where(cb.equal(root.get("firstName"), firstName));
        
        return entityManager.createQuery(query).getResultList();
    }
    
    public List<User> findByAgeRange(int minAge, int maxAge) {
        CriteriaBuilder cb = entityManager.getCriteriaBuilder();
        CriteriaQuery<User> query = cb.createQuery(User.class);
        Root<User> root = query.from(User.class);
        
        query.select(root)
             .where(cb.between(root.get("age"), minAge, maxAge))
             .orderBy(cb.asc(root.get("lastName")));
        
        return entityManager.createQuery(query).getResultList();
    }
}
```

### Dynamic Query Building

```java
public List<User> searchUsers(UserSearchCriteria criteria) {
    CriteriaBuilder cb = entityManager.getCriteriaBuilder();
    CriteriaQuery<User> query = cb.createQuery(User.class);
    Root<User> root = query.from(User.class);
    
    List<Predicate> predicates = new ArrayList<>();
    
    // Dynamically add conditions based on criteria
    if (criteria.getFirstName() != null) {
        predicates.add(cb.like(
            cb.lower(root.get("firstName")), 
            "%" + criteria.getFirstName().toLowerCase() + "%"
        ));
    }
    
    if (criteria.getEmail() != null) {
        predicates.add(cb.equal(root.get("email"), criteria.getEmail()));
    }
    
    if (criteria.getMinAge() != null) {
        predicates.add(cb.greaterThanOrEqualTo(root.get("age"), criteria.getMinAge()));
    }
    
    if (criteria.getMaxAge() != null) {
        predicates.add(cb.lessThanOrEqualTo(root.get("age"), criteria.getMaxAge()));
    }
    
    if (criteria.isActiveOnly()) {
        predicates.add(cb.isTrue(root.get("active")));
    }
    
    query.select(root)
         .where(predicates.toArray(new Predicate[0]));
    
    // Dynamic sorting
    if (criteria.getSortBy() != null) {
        if (criteria.getSortDirection() == SortDirection.DESC) {
            query.orderBy(cb.desc(root.get(criteria.getSortBy())));
        } else {
            query.orderBy(cb.asc(root.get(criteria.getSortBy())));
        }
    }
    
    TypedQuery<User> typedQuery = entityManager.createQuery(query);
    
    // Pagination
    if (criteria.getPage() != null && criteria.getSize() != null) {
        typedQuery.setFirstResult(criteria.getPage() * criteria.getSize());
        typedQuery.setMaxResults(criteria.getSize());
    }
    
    return typedQuery.getResultList();
}
```

### JPA Metamodel (Type-Safe)

Generate metamodel classes for compile-time safety:

```java
// Generated User_ class
@StaticMetamodel(User.class)
public class User_ {
    public static volatile SingularAttribute<User, Long> id;
    public static volatile SingularAttribute<User, String> firstName;
    public static volatile SingularAttribute<User, String> lastName;
    public static volatile SingularAttribute<User, String> email;
}

// Usage
public List<User> findByFirstName(String firstName) {
    CriteriaBuilder cb = entityManager.getCriteriaBuilder();
    CriteriaQuery<User> query = cb.createQuery(User.class);
    Root<User> root = query.from(User.class);
    
    query.select(root)
         .where(cb.equal(root.get(User_.firstName), firstName));  // Type-safe!
    
    return entityManager.createQuery(query).getResultList();
}
```

---

## 11. Caching

### Hibernate Cache Levels

```
                   Application
                       │
                       ▼
┌──────────────────────────────────────────┐
│         First-Level Cache (L1)           │
│         (Session/EntityManager)          │
│     Enabled by default, per-session      │
└──────────────────────────────────────────┘
                       │
                       ▼
┌──────────────────────────────────────────┐
│        Second-Level Cache (L2)           │
│        (SessionFactory-level)            │
│    Optional, shared across sessions      │
└──────────────────────────────────────────┘
                       │
                       ▼
┌──────────────────────────────────────────┐
│             Query Cache                  │
│     Caches query results (optional)      │
└──────────────────────────────────────────┘
                       │
                       ▼
                   Database
```

### First-Level Cache (L1)

Automatically enabled, scoped to Session/EntityManager.

```java
// Within same session
User user1 = entityManager.find(User.class, 1L);  // DB query
User user2 = entityManager.find(User.class, 1L);  // From L1 cache (same object!)

System.out.println(user1 == user2);  // true
```

### Second-Level Cache (L2)

Shared across sessions, requires configuration.

**Enable L2 Cache**:
```properties
# application.properties
spring.jpa.properties.hibernate.cache.use_second_level_cache=true
spring.jpa.properties.hibernate.cache.region.factory_class=org.hibernate.cache.jcache.JCacheRegionFactory
spring.jpa.properties.javax.cache.provider=org.ehcache.jsr107.EhcacheCachingProvider
```

**Mark Entity as Cacheable**:
```java
@Entity
@Cacheable
@org.hibernate.annotations.Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class Product {
    @Id
    private Long id;
    private String name;
    // ...
}
```

**Cache Concurrency Strategies**:

| Strategy | Description | Use Case |
|----------|-------------|----------|
| `READ_ONLY` | Never modified | Reference data |
| `NONSTRICT_READ_WRITE` | Rare updates, eventual consistency | Mostly-read data |
| `READ_WRITE` | Read and write with locks | Frequently updated |
| `TRANSACTIONAL` | Full JTA transactions | Critical data |

### Query Cache

Caches query results (use with caution).

```properties
spring.jpa.properties.hibernate.cache.use_query_cache=true
```

```java
@Query("SELECT u FROM User u WHERE u.active = true")
@QueryHints(@QueryHint(name = "org.hibernate.cacheable", value = "true"))
List<User> findActiveUsers();
```

---

## Summary

Key concepts covered today:

| Topic | Key Points |
|-------|------------|
| **ORM** | Maps objects to tables, bridges impedance mismatch |
| **Hibernate Architecture** | SessionFactory, Session, Transaction |
| **Entity Annotations** | @Entity, @Table, @Id, @Column, relationships |
| **hibernate.cfg.xml** | Traditional XML configuration |
| **Inheritance Strategies** | SINGLE_TABLE, JOINED, TABLE_PER_CLASS |
| **HQL** | Hibernate Query Language (object-oriented) |
| **JPQL** | JPA standard query language |
| **Native SQL** | Raw SQL for complex queries |
| **Criteria API** | Type-safe, dynamic query building |
| **Caching** | L1 (Session), L2 (shared), Query cache |

**Tomorrow**: Spring Data JPA repositories, derived queries, and transaction management!
