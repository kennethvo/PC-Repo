# Using GenAI for Code Generation

## Learning Objectives

- Apply AI effectively for code generation tasks
- Know which code generation tasks work well with AI
- Develop patterns for getting high-quality generated code
- Verify and integrate AI-generated code safely

## Why This Matters

Code generation is where AI provides the most immediate productivity gains. Mastering AI-assisted code generation lets you focus on architecture and business logic rather than boilerplate.

## The Concept

### What Works Well

| Task | AI Effectiveness | Why |
|------|------------------|-----|
| CRUD operations | ⭐⭐⭐⭐⭐ | Highly patterned |
| Entity/DTO classes | ⭐⭐⭐⭐⭐ | Predictable structure |
| Utility methods | ⭐⭐⭐⭐ | Common patterns |
| API endpoints | ⭐⭐⭐⭐ | Standard structure |
| Validation logic | ⭐⭐⭐⭐ | Well-defined rules |
| Data transformations | ⭐⭐⭐⭐ | Clear input/output |

### Code Generation Patterns

#### Pattern 1: Full Class Generation

**Prompt:**

```
Create a Spring Boot REST controller for managing orders.

Entity: Order (id, customerId, items, totalAmount, status, createdAt)
Service: OrderService (already exists)

Endpoints needed:
- GET /api/orders - list all, pagination
- GET /api/orders/{id} - get by id
- POST /api/orders - create new
- PUT /api/orders/{id}/status - update status only
- DELETE /api/orders/{id} - soft delete

Include validation, proper HTTP statuses, and logging.
```

#### Pattern 2: Method-by-Method

```java
public class OrderService {
    
    // Generate: method to calculate order total with tax
    // Tax rules: 8% for electronics, 0% for food, 6% for everything else
    
}
```

Let AI suggest one method at a time.

#### Pattern 3: From Interface/Signature

```java
public interface PaymentProcessor {
    PaymentResult processPayment(PaymentRequest request);
    RefundResult processRefund(String transactionId, BigDecimal amount);
    PaymentStatus checkStatus(String transactionId);
}

// Generate: Implementation class with Stripe integration
```

### Effective Code Generation Prompts

#### For Entity Classes

```
Create a JPA entity for Order with:
- Auto-generated Long id
- ManyToOne relation to Customer
- OneToMany relation to OrderItem
- BigDecimal totalAmount (precision 10, scale 2)
- Enum status (PENDING, PROCESSING, SHIPPED, DELIVERED, CANCELLED)
- Audit fields with @CreatedDate and @LastModifiedDate
- Lombok annotations for boilerplate

Use Jakarta persistence annotations.
```

#### For Service Methods

```
In OrderService, create a method:

Name: createOrder
Parameters: CreateOrderRequest (customerId, list of product IDs with quantities)
Returns: OrderResponse

Logic:
1. Validate customer exists
2. Validate all products exist and have sufficient stock
3. Calculate total price from product prices × quantities
4. Create order with PENDING status
5. Reduce stock for each product
6. Return created order

Uses: @Transactional, throws appropriate exceptions
```

#### For Controllers

```
Create endpoint in OrderController:

POST /api/orders
- Request body: CreateOrderRequest (validated)
- Calls OrderService.createOrder
- Returns 201 Created with OrderResponse
- Returns 400 for validation errors
- Returns 404 if customer or product not found
- Include OpenAPI annotations
```

### Verification Workflow

```
AI generates code
        ↓
Read and understand every line
        ↓
Check: Does it compile?
        ↓
Check: Are imports correct?
        ↓
Check: Does logic match requirements?
        ↓
Run existing tests
        ↓
Add new tests for generated code
        ↓
Integration test if applicable
```

### Common Issues and Fixes

| Issue | Example | Fix |
|-------|---------|-----|
| Wrong imports | `import org.springframework.*` | Specify framework version |
| Outdated patterns | `javax.persistence` | Specify "Jakarta" in prompt |
| Missing null checks | `user.getName().toLowerCase()` | Ask for null safety |
| Hardcoded values | Magic numbers | Request constants |

### Best Practices

1. **Be specific about versions**

   ```
   "Using Spring Boot 3.2, Java 17, Jakarta EE"
   ```

2. **Specify patterns explicitly**

   ```
   "Use constructor injection, not @Autowired"
   ```

3. **Request defensive coding**

   ```
   "Include null checks and input validation"
   ```

4. **Ask for tests alongside code**

   ```
   "Include unit test examples for this method"
   ```

## Summary

- AI excels at CRUD, entities, DTOs, and standard patterns
- Use structured prompts with clear specifications
- Generate incrementally (class then methods)
- Always verify: compile, test, review
- Specify versions and patterns explicitly

## Additional Resources

- [Code Generation Best Practices - GitHub](https://github.blog/2023-06-20-how-to-write-better-prompts-for-github-copilot/)
