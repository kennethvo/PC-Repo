# Code Optimization with AI

## Learning Objectives

- Use AI to identify performance improvements
- Apply AI-suggested optimizations responsibly
- Understand AI's limitations in optimization
- Balance AI suggestions with profiling data

## Why This Matters

Performance matters. AI can spot common inefficiencies quickly, but optimization requires understanding your specific context. Learn to use AI as an optimization advisor, not an automatic optimizer.

## The Concept

### What AI Can Optimize

| Area | AI Capability | Notes |
|------|---------------|-------|
| Algorithm complexity | ⭐⭐⭐⭐ | Spots obvious O(n²) to O(n) |
| Unnecessary operations | ⭐⭐⭐⭐ | Finds redundant loops/calls |
| Collection choice | ⭐⭐⭐⭐ | ArrayList vs LinkedList |
| Stream optimization | ⭐⭐⭐ | Parallel, short-circuit |
| Memory efficiency | ⭐⭐⭐ | Basic patterns |
| Database queries | ⭐⭐⭐ | N+1, missing indexes |

### AI Optimization Prompts

#### General Review

```
Review this code for performance issues:

```java
public List<UserDTO> getActiveUsers() {
    List<User> allUsers = userRepository.findAll();
    List<UserDTO> result = new ArrayList<>();
    for (User user : allUsers) {
        if (user.isActive()) {
            UserDTO dto = new UserDTO();
            dto.setId(user.getId());
            dto.setName(user.getName());
            dto.setEmail(user.getEmail());
            dto.setOrders(orderRepository.findByUserId(user.getId()));
            result.add(dto);
        }
    }
    return result;
}
```

Identify performance issues and suggest improvements.

```

**AI identifies:**
- Filtering in memory (should be in query)
- N+1 query problem (orders fetched per user)
- Manual mapping (could use mapper)

#### Specific Optimization

```

Optimize this method for high throughput (1000+ calls/second):

```java
public boolean isUserAllowed(Long userId, String permission) {
    User user = userRepository.findById(userId).orElseThrow();
    List<Role> roles = user.getRoles();
    for (Role role : roles) {
        List<Permission> perms = permissionRepository.findByRoleId(role.getId());
        for (Permission perm : perms) {
            if (perm.getName().equals(permission)) {
                return true;
            }
        }
    }
    return false;
}
```

Suggest caching strategies and query optimization.

```

### Common Optimizations AI Suggests

#### 1. Query Optimization

**Before:**
```java
List<User> users = userRepository.findAll();
users = users.stream()
    .filter(u -> u.getDepartment().equals(dept))
    .collect(Collectors.toList());
```

**After:**

```java
List<User> users = userRepository.findByDepartment(dept);
```

#### 2. N+1 Query Fix

**Before:**

```java
List<Order> orders = orderRepository.findAll();
for (Order order : orders) {
    Customer c = customerRepository.findById(order.getCustomerId());
    // Uses c
}
```

**After:**

```java
@Query("SELECT o FROM Order o JOIN FETCH o.customer")
List<Order> findAllWithCustomers();
```

#### 3. Stream Optimization

**Before:**

```java
list.stream()
    .map(this::expensiveOperation)
    .filter(x -> x != null)
    .findFirst();
```

**After:**

```java
list.stream()
    .filter(x -> checkCondition(x))  // Filter first
    .map(this::expensiveOperation)
    .findFirst();
```

### Verification Required

AI optimizations need verification:

```
┌─────────────────────────────────────────────────────────────┐
│          OPTIMIZATION VERIFICATION                          │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  1. Does it still work correctly?                          │
│     → Run existing tests                                   │
│                                                             │
│  2. Is it actually faster?                                 │
│     → Profile before/after                                 │
│                                                             │
│  3. Is it worth the complexity?                            │
│     → Consider maintainability                             │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### AI Limitations in Optimization

| Limitation | Why |
|------------|-----|
| No runtime data | Can't see actual bottlenecks |
| No load patterns | Doesn't know usage patterns |
| Context blind | Doesn't know infrastructure |
| Over-optimization | May suggest unnecessary changes |

**Best approach:** Profile first, then ask AI about specific hot spots.

## Summary

- AI spots common performance antipatterns effectively
- Common suggestions: query optimization, N+1 fixes, algorithm improvements
- Always verify with tests and profiling
- AI lacks runtime context—combine with actual metrics
- Don't optimize prematurely; profile first

## Additional Resources

- [Java Performance Tuning](https://www.baeldung.com/java-performance)
- [Spring Boot Performance](https://docs.spring.io/spring-boot/docs/current/reference/html/actuator.html)
